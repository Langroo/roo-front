const crypto = require('crypto');
const flowPositions = require('./flowPositions');
const API = require('./rooCoreApi').rooCoreApi;
const generateHash = str => crypto.createHash('md5').update(str).digest('hex');
require('dotenv').config();

// -- Function that returns specific Dialogues and set specific flows for administrators
function getAdminDialogues(input, senderId) {
  const FbAPIClass = require('./botTools').FacebookAPI;
  const FacebookAPI = new FbAPIClass(senderId);

  const delayActivationRegex = /activate message delay/i;
  const delayDeactivationRegex = /deactivate message delay/i;
  const flowResetRegex = /roo masters 101/i;
  API.retrieveUser(senderId)
    .then((profile) => {
      if (!profile.data.is_admin) {
        console.log('PROFILE DATA :: ', profile);
        return FacebookAPI.SendMessages('text', 'You are not an admin 🚫');
      }
      // -- Sets the user in the opentalk context and allows access to all contexts
      if (flowResetRegex.test(input)) {
        API.updateFlow(senderId, flowPositions('adminFlowReset'))
          .then(() => API.createInitialUserProfile(senderId)
            .then(() => {
              FacebookAPI.SendMessages('quickReplies',
                {
                  title: '✔ CONTEXT ADMIN RESET SUCCESSFUL 👍. \nYou are now in the opentalk Context. 👀',
                  buttons: [
                    { title: 'Continue', value: 'random_data' },
                  ],
                })
                .then(() => true);
            }));
      }

      // -- Allow deactivation of the delays between messages only if this env variable is set
      if (process.env.DELAY_DEACTIVATION_ALLOWED) {
        if (delayActivationRegex.test(input)) {
          API.updateFlow(senderId, { message_delay: 'on' })
            .then(() => FacebookAPI.SendMessages('text', 'BOT :: ⌛⏳ Delay between messages ACTIVE ☑. \nYou may continue operations. \nFlow is unaltered')
              .then(() => true));
        } else if (delayDeactivationRegex.test(input)) {
          API.updateFlow(senderId, { message_delay: 'off' })
            .then(() => FacebookAPI.SendMessages('text', 'BOT :: ⌛⏳ Delay between messages DEACTIVATED 🚫. \nYou may continue operations. \nFlow is unaltered')
              .then(() => true));
        }
      }
    });
}

function getUserName(payload) {
  return {
    senderName: payload.profile.first_name,
    fullName: `${payload.profile.first_name} ${payload.profile.last_name}`,
  };
}

// -- Contexts that prevent interaction with other contexts until finished
function isLockedContext(params, isPostback) {
  const stopBotKeywords = /(^stop bot$|^freeze the current flow$|^unsuscribe$|^stop the content$|^cancel subscription$|^unsubscribe$|^stop$)/i;
  if (stopBotKeywords.test(params.rawUserInput)) {
    params = Object.assign({}, params, { currentFlow: 'general', currentEntity: 'stopBotMessages' });
  }

  if (params.currentPos === 'quiz' && params.awaitingAnswer && !isPostback) {
    params = Object.assign({}, params, { currentFlow: 'content', currentEntity: 'quizReceivedReply' });
    return params;
  }

  return params;
}

function getUserDialogues(data, rawInput) {
  const context = require('./contexts');
  const { getEntityAndFlow } = require('./inputHandler');
  const Cron = require('node-schedule');
  const { FacebookAPI, universal } = require('./botTools');
  const { replier } = universal;
  const fbAPIInstance = new FacebookAPI(data.sender.id);
  const timeOfSending = new Date(Date.now() + 11000);

  // -- Flow control variables
  let params; let readyToReply; let senderName; let fullName; let userFromDB; let firstTime; let
    reply;

  // -- Declare and define initial state of container of the entity and flow/context
  let entityAndFlow = {};

  // -- Include the userHash inside the object message received
  const userHash = generateHash(data.sender.id);
  data = Object.assign({}, data, { userHash });

  async function brain(brainRawInput, payload, userFlow) {
    // -- Initialize variable that indicates if user input comes from pressing a button
    let isPostback;
    payload.postback
      ? isPostback = true
      : isPostback = false;

    senderName = getUserName(payload).senderName;
    fullName = getUserName(payload).fullName;

    // -- Retrieve the flow control variables of the user FROM REDIS
    userFlow = await API.retrieveFlow(payload.sender.id);

    // -- Allow the bot to reply the user after a few seconds after the last reply
    Cron.scheduleJob(timeOfSending, () => {
      API.updateFlow(payload.sender.id, { ready_to_reply: true });
    });

    // -- Retrieve the user profile from MongoDB using the APIDB endpoint
    try {
      userFromDB = await API.retrieveUser(payload.sender.id);
      if (!userFromDB.data) {
        console.error('->>> User Account could not be retrieved <<<-');
        userFromDB.data = null;
        if (firstTime) {
          entityAndFlow.flow = 'introduction';
          entityAndFlow.entity = 'getStarted';
        } else {
          entityAndFlow = getEntityAndFlow(brainRawInput);
        }
      } else {
        let userStatus;
        userFromDB.data.subscription ? userStatus = userFromDB.data.subscription : userStatus = null;
        userStatus ? userStatus = userStatus.status : userStatus = 'UNREGISTERED';
        params = Object.assign({}, { status: userStatus });
        entityAndFlow = getEntityAndFlow(brainRawInput);
      }
    } catch (error) {
      console.error('Unbelievable Error ::', error);
    }

    // If the user is on the DB, register the time when he last send a message to the bot
    // Hold any further reply until the last message is completely processed
    await API.updateFlow(payload.sender.id, { last_interaction: Date(), ready_to_reply: 'false' });

    // -- Initializing flow controlling variables
    try {
      params = {
        senderName,
        lastInteraction: userFlow.data.last_interaction,
        currentEntity: entityAndFlow.entity,
        currentFlow: entityAndFlow.flow,
        currentPos: userFlow.data.current_pos,
        prevPos: userFlow.data.prev_pos,
        nextPos: userFlow.data.next_pos,
        prevFlow: userFlow.data.prev_flow,
        translateDialog: userFlow.data.translate_dialog,
        OpQ: userFlow.data.open_question,
        repeatedThisPos: userFlow.data.repeated_this_pos,
        rawUserInput: brainRawInput,
        autoresponderReply: userFlow.data.autoresponder_reply,
        autoresponderType: userFlow.data.autoresponder_type,
        messageDelay: userFlow.data.message_delay,
        reminderList: userFlow.data.reminder_list,
        tutorFlowStatus: userFlow.data.tutor_flow_status,
        awaitingAnswer: userFlow.data.awaiting_answer,
        fullName,
      };
      params.awaitingAnswer === '1' ? params.awaitingAnswer = true : params.awaitingAnswer = false;
      params.OpQ === 'false' ? params.OpQ = false : params.OpQ = true;
      params.translateDialog === 'false' ? params.translateDialog = false : params.translateDialog = true;

      // -- Define if the delay between messages is ON or OFF
      process.env.messageDelay = params.messageDelay;
    } catch (error) {
      console.error('Error while initializing the flow controlling variables :: ', error);
    }

    // -- Set the currentEntity according to its current value after the inputHandler
    if (params.currentEntity) {
      await API.updateFlow(payload.sender.id, { prev_pos: params.currentPos });
    } else if (!params.currentEntity) {
      params.OpQ
        ? params.currentPos = params.nextPos
        : params.prevPos = params.currentPos;
      params.currentFlow = userFlow.data.current_flow;
    }

    // -- Check if the user is in a Locked Context
    params = Object.assign({}, params, isLockedContext(params, isPostback));

    // -- Console logs for Flow control
    console.info('\n################## FLOW CONTROL REDIS VARIABLES ######################');
    console.info('- Raw Input :: %s\n- SenderId :: [%s]\n- Username: [%s]\n- Last Interaction :: [%s]\n- Entity :: [%s]\n- Current Flow :: [%s]\n- PrevPos :: [%s]\n- CurrentPos :: [%s]\n- NextPos :: [%s]\n- OpenQuestion :: [%s]\n- PrevFlow :: [%s]\n- Translate Next dialogue :: [%s]\n- This position has been repeated :: [%s] times\n- User surveyed :: [%s]\n- User Reminders :: [%s]',
      params.rawUserInput, payload.sender.id, params.fullName, params.lastInteraction, params.currentEntity, params.currentFlow, params.prevPos, params.currentPos, params.nextPos, params.OpQ, params.prevFlow, params.translateDialog, params.repeatedThisPos, params.reminderList);
    console.info('#######################################################################\n');

    // -- CONDITIONAL'S GROUP: CONTROLLER OF MAIN ENTITIES AND CONVERSATIONAL FLOWS
    if (params.currentFlow === 'opentalk') {
      reply = context.opentalk(payload, params, userFromDB);
    } else if (params.currentFlow === 'general') {
      console.log('----------------------------\nGeneral option requested\n----------------------------');
      try { fbAPIInstance.HandoverSwitch(1); } catch (error) { console.log('Error sending request to switch user conversation control back to the Bot'); }
      reply = context.general(payload, params, userFromDB);
    } else if (params.currentFlow === 'introduction') {
      console.log('----------------------------\nEntering introduction flow\n----------------------------');
      await API.updateFlow(payload.sender.id, { current_flow: 'introduction' });
      reply = context.introduction(payload, params, userFromDB);
    } else if (params.currentFlow === 'tutor') {
      console.log('----------------------------\nEntering tutor flow\n----------------------------');
      await API.updateFlow(payload.sender.id, { current_flow: 'tutor' });
      reply = context.tutor(payload, params, userFromDB);
    } else if (params.currentFlow === 'content') {
      console.log('----------------------------\nEntering content flow\n----------------------------');
      await API.updateFlow(payload.sender.id, { current_flow: 'content' });
      reply = context.content(payload, params, userFromDB);
    } else {
      console.log('----------------------------\nEntering open-talk flow\n----------------------------');
      reply = context.opentalk(payload, params, userFromDB);
    }
    return reply;
  }

  /* Section where the message is received and processed */

  API.retrieveFlow(data.sender.id)
    .then(async (userFlowData) => {
      if (!userFlowData.data) {
        console.info('This user lacks a Flow Collection, creating it!!!');
        firstTime = true;
        await API.createFlow(data.sender.id, flowPositions('newUser'));
        userFlowData = await API.retrieveFlow(data.sender.id);
      }

      // -- Allow user input processing after 6 seconds of the last interaction
      if ((userFlowData.data.last_interaction + 10000) < Date()) {
        await API.updateFlow(data.sender.id, { ready_to_reply: 'true' });
        readyToReply = true;
      } else {
        readyToReply = userFlowData.data.ready_to_reply;
      }

      // -- If the bot is ready to reply
      if (readyToReply !== 'false') {
        // -- Bot is shut down to prevent more replies being triggered from additional user input before the actual one is sent
        await API.updateFlow(data.sender.id, { ready_to_reply: 'false' });
        brain(rawInput, data, userFlowData)
          .then(async (replyToSend) => {
            if (replyToSend) { await replier(0, replyToSend, userFromDB, data.sender.id); }
          });
      } else {
        console.info('\n### BOT STILL REPLYING ###\n');
      }
    });
  API.updateFlow(data.sender.id, { ready_to_reply: 'true' });
}

module.exports = {
  getUserDialogues,
  getAdminDialogues,
};

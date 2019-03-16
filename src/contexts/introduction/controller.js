const getReply = async (message, params, userFromDB) => {
  // Requirementes and imports of external modules and libraries
  const API = require('../../core/index').dbApi;
  const standardReplies = require('./responses').standardReplies;
  const langNames = require('./languages');
  const { translateReply, killCronJob, cronReminder } = require('../../bot-tools').universal;
  const BotCache = require('../../bot-tools').BotCache;

  // Variables
  const flows = require('../index');
  const reminderReplies = require('../index').reminderReplies;
  let reply; let FlowUpdate; let willCreateUser; let DelayedUpdate; let reminderToContinueOn;
  let tempReply; let trueReply;


  let delayedReplies; let userLanguage; let langVar; let userMustPressButton;
  const dontTranslateThisRegex = true;

  // -- Seconds before sending a reminder or a delayed reply
  let waitingTime;

  // -- Messages positions to skip from translating
  const skipTranslationIndex = [];

  // -- Variable to control which Dialogues will be translated
  let translateActive = params.translateDialog;
  if (userFromDB.data) {
    userLanguage = userFromDB.data.language.substr(0, 2);
  } else {
    userLanguage = 'en';
  }

  /**
   * Replies in case of unexpected user input during a button guided question
   * Every message here has the open_question parameter set to false
   * */

  if (params.rawUserInput === 'start_other_language') {
    translateActive = true;
  }
  if (params.currentEntity === undefined && params.OpQ) {
    params.currentEntity = params.currentPos;
  } else if (params.currentEntity === undefined && !params.OpQ) {
    langVar = langNames(userLanguage);
    langVar = langVar.charAt(0).toUpperCase() + langVar.slice(1);
    userMustPressButton = true;
    DelayedUpdate = {
      current_pos: params.prevPos, open_question: 'false', prev_pos: params.prevPos, next_pos: 'TBD', prev_flow: 'introduction', repeated_this_pos: '1',
    };
    if (params.repeatedThisPos === '0') {
      delayedReplies = reminderReplies('pressBtnFirstReminder', params.senderName, langVar).concat(standardReplies(params.prevPos, params.senderName, langVar).pop());
    } else {
      delayedReplies = reminderReplies('pressBtnSecondReminder', params.senderName, langVar).concat(standardReplies(params.prevPos, params.senderName, langVar).pop());
    }
    if (userLanguage !== 'en' && translateActive) {
      delayedReplies = await translateReply(delayedReplies, userLanguage);
    }
    // -- Initialize reply as empty to avoid No-Reply autoresponder trigger
    reply = [];
  }

  // -- Create basic account in DB for new - unregistered users
  if (!userFromDB.data) { await API.createInitialUserProfile(message.sender.id, message.conversation); }

  /* ******************************************************************************************************************************************************
   * ************************************ Replies to user input according to pre-programmed flow **********************************************************
   * ***************************************************************************************************************************************************** */

  switch (params.currentEntity) {
    case 'getStarted':
      reply = standardReplies('getStarted', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: 'getStarted', open_question: true, prev_pos: 'getStarted', next_pos: '_userChoosesLanguage', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_userChoosesLanguage':
      reply = standardReplies('_userChoosesLanguage', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_userChoosesLanguage', open_question: true, prev_pos: '_userChoosesLanguage', next_pos: '_userIsNewOrInvited', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_userIsNewOrInvited':
      reply = standardReplies('_userIsNewOrInvited', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_userIsNewOrInvited', open_question: 'false', prev_pos: '_userIsNewOrInvited', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_userHasInvite':
      reply = standardReplies('_userHasInvite', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_userHasInvite', open_question: true, prev_pos: '_userHasInvite', next_pos: '_hardestThing', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_hardestThing':
      reply = standardReplies('_hardestThing', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_hardestThing', open_question: true, prev_pos: '_hardestThing', next_pos: '_alreadyHadACall', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_hardestThingNewUser':
      reply = standardReplies('_hardestThingNewUser', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_hardestThingNewUser', open_question: true, prev_pos: '_hardestThingNewUser', next_pos: '_alreadyHadACall', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_explainABitToUser':
      reply = standardReplies('_explainABitToUser', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_explainABitToUser', open_question: 'false', prev_pos: '_explainABitToUser', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_willProceedWithFreeTrial':
      reply = standardReplies('_willProceedWithFreeTrial', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_willProceedWithFreeTrial', open_question: 'false', prev_pos: '_willProceedWithFreeTrial', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_wontProceedWithFreeTrial':
      reply = standardReplies('_wontProceedWithFreeTrial', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_wontProceedWithFreeTrial', open_question: true, prev_pos: '_wontProceedWithFreeTrial', next_pos: '_introFinalNoFreeTrial', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_introFinalNoFreeTrial':
      reply = standardReplies('_introFinalNoFreeTrial', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_introFinalNoFreeTrial', open_question: true, prev_pos: '_wontProceedWithFreeTrial', next_pos: 'TBD', current_flow: 'opentalk', prev_flow: 'opentalk',
      };
      break;

    case '_alreadyHadACall':
      reply = standardReplies('_alreadyHadACall', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_alreadyHadACall', open_question: true, prev_pos: '_alreadyHadACall', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_awaitingOurFirstCall':
      reply = standardReplies('_awaitingOurFirstCall', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_awaitingOurFirstCall', open_question: true, prev_pos: '_awaitingOurFirstCall', next_pos: '_newUser', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_newUser':
      reply = standardReplies('_newUser', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_newUser', open_question: true, prev_pos: '_newUser', next_pos: '_explainABitToUser', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput);
      break;

    case '_userAllDoneDialog':
      reply = standardReplies('_userAllDoneDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_userAllDoneDialog', open_question: true, prev_pos: '_userAllDoneDialog', next_pos: '_howQuizWorksDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput);
      break;

    case 'introFinal':
      if (params.tutorFlowStatus === 'requested') {
        reply = standardReplies('jumpToTutorFlow', params.senderName);
        willCreateUser = true;
        reminderToContinueOn = false;
        FlowUpdate = {
          current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'opentalk', prev_flow: 'opentalk', repeated_this_pos: '0',
        };
      } else {
        reply = standardReplies('introFinal', params.senderName);
        willCreateUser = true;
        reminderToContinueOn = false;
        FlowUpdate = {
          current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'opentalk', prev_flow: 'opentalk', repeated_this_pos: '0',
        };
      }
      break;

    case 'introPostFinal':
      reply = standardReplies('introPostFinal', params.senderName);
      reminderToContinueOn = false;
      FlowUpdate = {
        current_pos: 'introPostFinal', open_question: 'false', prev_pos: 'introPostFinal', next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk', repeated_this_pos: '0',
      };
      break;

    case 'reliefOfUserContinuing':
      params.currentEntity = params.prevPos;
      tempReply = await flows.introduction(message, params, userFromDB);
      trueReply = [tempReply.pop()];
      return standardReplies('reliefOfUserContinuing', params.senderName).concat(trueReply);

    default:
      if (!reply) {
        console.info('❌ No case matched, reply at Introduction Context Undefined ¯\\_(ツ)_/¯');
      }
  }

  if (!reply) {
    params.currentEntity = 'fallback';
    params.prevFlow = 'fallback';
    reply = await flows.opentalk(message, params, userFromDB);
    return reply;
  }

  /**
   * Update Flow Collection of the User in MongoDB
   * */

  if (willCreateUser) {
    const r = await API.createFullUserProfile(message.sender.id);
    if (r.statusCode >= 200 && r.statusCode < 300) { console.info('User Profile Created in [APIDB] Successfully'); } else { console.error('ERROR :: User Profile Creation after INTRODUCTION has been UNSUCCESSFUL'); }
    await API.updateContext(message.sender.id, { finished_flows: 'introduction' });
  }

  if (reminderToContinueOn) {
    waitingTime = 18000;
    if (process.env.DEBUG_MODE === 'true' || process.env.DEBUG_MODE === '1') {
      console.log('DEBUG MODE IS ENABLED - REMINDER TO COMPLETE INTRO FLOW WILL BE SENT IN 40 SECONDS INSTEAD OF NORMAL TIME');
      waitingTime = 40;
    }

    killCronJob(params.prevPos, message.sender.id);

    /*
    * In the particular case that the user talks for the first time to the bot and does not continue
    * the conversation, we will send as the reminder the next message/dialog
    * */
    if (params.currentEntity === 'getStarted') {
      FlowUpdate = Object.assign({}, FlowUpdate, { current_pos: '_userChoosesLanguage' });
      params.currentEntity = '_userChoosesLanguage';
      cronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB);
    } else {
      cronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB);
    }
  }

  if (userLanguage !== 'en' && translateActive) {
    reply = await translateReply(reply, userLanguage, skipTranslationIndex, dontTranslateThisRegex);
  }

  if (userMustPressButton) {
    let time = 6;
    if (params.repeatedThisPos) { time = 10; }
    cronReminder(params.currentPos, delayedReplies, time, DelayedUpdate, message.sender.id, userFromDB);
    return;
  }

  // -- Update REDIS flow control variables
  if (FlowUpdate) {
    API.updateFlow(message.sender.id, FlowUpdate);
  }

  return await reply;
};

module.exports = getReply;

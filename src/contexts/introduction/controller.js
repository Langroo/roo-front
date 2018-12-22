const getReply = async (message, params, userFromDB) => {
  // Requirementes and imports of external modules and libraries
  const API = require('../../core/index').dbApi;
  const standardReplies = require('./responses').standardReplies;
  const langNames = require('./languages');
  const OneForAll = require('../../bot-tools').OneForAll;
  const BotCache = require('../../bot-tools').BotCache;

  // -- Instantiations
  const controllerSmash = new OneForAll();

  // Variables
  const flows = require('../index');
  const reminderReplies = require('../index').reminderReplies;
  let reply; let replyTranslated; let FlowUpdate; let willCreateUser; let DelayedUpdate; let reminderToContinueOn;


  let delayedReplies; let userLanguage; let userSpeaksEnglish; let langVar; let userMustPressButton; let
    dontTranslateThisRegex;

  // -- Seconds before sending a reminder or a delayed reply
  let waitingTime;

  // -- Messages positions to skip from translating
  const skipTranslationIndex = [];

  // -- Variable to control which dialogs will be translated
  let translateActive = params.translateDialog;
  if (userFromDB.data) {
    userLanguage = userFromDB.data.language.substr(0, 2);
    userSpeaksEnglish = userLanguage === 'en';
  } else {
    userLanguage = 'en';
    userSpeaksEnglish = true;
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
      delayedReplies = await controllerSmash.translateReply(delayedReplies, userLanguage);
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
        current_pos: 'getStarted', open_question: true, prev_pos: 'getStarted', next_pos: '_introduceMyselfDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_introduceMyselfDialog':
      reply = standardReplies('_introduceMyselfDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_introduceMyselfDialog', open_question: true, prev_pos: '_introduceMyselfDialog', next_pos: '_welcomeVideoDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_welcomeVideoDialog':
      reply = standardReplies('_welcomeVideoDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_welcomeVideoDialog', open_question: true, prev_pos: '_welcomeVideoDialog', next_pos: '_englishQuizDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_englishQuizDialog':
      reply = standardReplies('_englishQuizDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_englishQuizDialog', open_question: true, prev_pos: '_englishQuizDialog', next_pos: '_motivationToLearnDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_motivationToLearnDialog':
      reply = standardReplies('_motivationToLearnDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_motivationToLearnDialog', open_question: 'false', prev_pos: '_motivationToLearnDialog', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      break;

    case '_otherMotivationDialog':
      reply = standardReplies('_otherMotivationDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_otherMotivationDialog', open_question: true, prev_pos: '_otherMotivationDialog', next_pos: '_englishLevelDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput);
      break;

    case '_englishLevelDialog':
      reply = standardReplies('_englishLevelDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_englishLevelDialog', open_question: 'false', prev_pos: '_heardAboutLangrooDialog1', next_pos: '_heardAboutLangrooDialog2', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput);
      break;

    case '_heardAboutLangrooDialog1':
      reply = standardReplies('_heardAboutLangrooDialog1', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_heardAboutLangrooDialog1', open_question: 'false', prev_pos: '_heardAboutLangrooDialog1', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
      };
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput);
      break;

    case '_heardAboutLangrooDialog2':
      reply = standardReplies('_heardAboutLangrooDialog2', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_heardAboutLangrooDialog2', open_question: true, prev_pos: '_heardAboutLangrooDialog2', next_pos: '_userAllDoneDialog', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false',
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

    case '_howQuizWorksDialog':
      reply = standardReplies('_howQuizWorksDialog', params.senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: '_howQuizWorksDialog', open_question: 'false', prev_pos: '_howQuizWorksDialog', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'opentalk', translate_dialog: 'false',
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
      const tempReply = await flows.introduction(message, params, userFromDB);
      const trueReply = [tempReply.pop()];
      return reply = standardReplies('reliefOfUserContinuing', params.senderName).concat(trueReply);

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

    controllerSmash.killCronJob(params.prevPos, message.sender.id);

    /*
    * In the particular case that the user talks for the first time to the bot and does not continue
    * the conversation, we will send as the reminder the next message/dialog
    * */
    if (params.currentEntity === 'getStarted') {
      FlowUpdate = Object.assign({}, FlowUpdate, { current_pos: '_introduceMyselfDialog' });
      params.currentEntity = '_introduceMyselfDialog';
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB);
    } else {
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB);
    }
  }

  if (userLanguage !== 'en' && translateActive) {
    reply = await controllerSmash.translateReply(reply, userLanguage, skipTranslationIndex, dontTranslateThisRegex);
  }

  if (userMustPressButton) {
    let time = 6;
    if (params.repeatedThisPos) { time = 10; }
    controllerSmash.CronReminder(params.currentPos, delayedReplies, time, DelayedUpdate, message.sender.id, userFromDB);
    return;
  }

  // -- Update REDIS flow control variables
  if (FlowUpdate) {
    API.updateFlow(message.sender.id, FlowUpdate);
  }

  return await reply;
};

module.exports = getReply;

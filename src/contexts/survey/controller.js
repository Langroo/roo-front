const getReply = async (message, params, userFromDB) => {
  // -- Import of static function containers
  const API = require('../../core/index').dbApi;
  const standardReplies = require('./responses').standardReplies;
  const OneForAll = require('../../bot-tools').OneForAll;
  const BotCache = require('../../bot-tools').BotCache;

  // -- Instantiations
  const controllerSmash = new OneForAll();
  // Variables
  const flows = require('../index');
  const senderName = params.senderName;
  let reply;
  let FlowUpdate;
  let willSendDelayedReply;
  let flowUpdateReminderMsg;
  let DelayedUpdate;
  let reminderToContinueOn;
  let delayedReplies;
  let reminderReplies;
  let userMustPressButton;
  let waitingTime;
  const delayTime = 15;
  const surveyEntities = ['surveyQuestion1', 'surveyQuestion2', 'otherProblemLearning', 'surveyQuestion3', 'surveyQuestion4', 'surveyQuestion5', 'surveyQuestion6', 'surveyQuestion7', 'otherMostImportant', 'surveyQuestion8', 'surveyQuestion9', 'surveyQuestion10', 'noJoinCommunity', 'yesJoinCommunity'];

  /**
   * Username definer
   * */

  /**
   * Replies in case of unexpected user input during a button guided question
   * Every message here has the open_question parameter set to false
   * */
  if (params.currentEntity === undefined && params.OpQ) {
    params.currentEntity = params.currentPos;
  } else if (params.currentEntity === 'continueSurvey') {
    params.currentFlow = 'survey';

    if (surveyEntities.indexOf(params.prevPos) > -1) {
      params.currentEntity = params.prevPos;
    } else if (surveyEntities.indexOf(params.surveyDone) > -1) {
      params.currentEntity = params.surveyDone;
    } else {
      params.currentEntity = 'surveyQuestion1';
    }
  } else if (params.currentEntity === undefined && !params.OpQ) {
    userMustPressButton = true;
    DelayedUpdate = {
      current_pos: params.prevPos, open_question: 'false', prev_pos: params.prevPos, next_pos: params.nextPos, prev_flow: 'survey', repeated_this_pos: '1',
    };
    delayedReplies = standardReplies('askIfTiredOfSurvey', senderName);
    // -- Initialize reply as empty to avoid No-Reply autoresponder trigger
    reply = [];
  }

  /* ***************************************** If the user ALREADY did te survey ************************************************************************* */

  if (params.surveyDone === 'survey completed' || params.surveyDone === 'yes') {
    params.currentEntity = 'willDoSurvey';
    return await flows.opentalk(message, params, userFromDB);
  }

  /* ******************************************************************************************************************************************************
   * ************************************ Replies to user input according to pre-programmed flow **********************************************************
   * ***************************************************************************************************************************************************** */

  switch (params.currentEntity) {
    case 'confirmTiredOfSurvey':
      reply = standardReplies('confirmTiredOfSurvey', senderName);
      reminderToContinueOn = false;
      FlowUpdate = {
        current_pos: 'confirmTiredOfSurvey', open_question: true, prev_pos: params.prevPos, next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk',
      };
      break;

    case 'surveyQuestion1':
      reply = standardReplies('surveyQuestion1', senderName);
      reminderToContinueOn = true;
      FlowUpdate = {
        current_pos: 'surveyQuestion1', open_question: 'false', prev_pos: 'surveyQuestion1', next_pos: 'surveyQuestion2', prev_flow: 'survey',
      };
      break;

    case 'surveyQuestion2':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'importance', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion2', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion2', open_question: 'false', prev_pos: 'surveyQuestion2', next_pos: 'TBD', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'otherProblemLearning':
      reply = standardReplies('otherProblemLearning', senderName);
      FlowUpdate = {
        current_pos: 'otherProblemLearning', open_question: true, prev_pos: 'otherProblemLearning', next_pos: 'surveyQuestion3', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion3':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'problem', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion3', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion3', open_question: true, prev_pos: 'surveyQuestion3', next_pos: 'surveyQuestion4', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion4':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'help', params.rawUserInput, false);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion4', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion4', open_question: 'false', prev_pos: 'surveyQuestion4', next_pos: 'surveyQuestion5', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion5':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'most_important1', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion5', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion5', open_question: true, prev_pos: 'surveyQuestion5', next_pos: 'surveyQuestion6', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion6':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'currently_using', params.rawUserInput, false);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion6', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion6', open_question: true, prev_pos: 'surveyQuestion6', next_pos: 'surveyQuestion7', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion7':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'likes_dislikes', params.rawUserInput, false);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion7', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion7', open_question: 'false', prev_pos: 'surveyQuestion7', next_pos: 'surveyQuestion8', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'otherMostImportant':
      reply = standardReplies('otherMostImportant', senderName);
      FlowUpdate = {
        current_pos: 'otherMostImportant', open_question: true, prev_pos: 'otherMostImportant', next_pos: 'surveyQuestion8', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion8':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'most_important2', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion8', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion8', open_question: 'false', prev_pos: 'surveyQuestion8', next_pos: 'surveyQuestion9', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion9':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'friend_idea', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion9', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion9', open_question: 'false', prev_pos: 'surveyQuestion9', next_pos: 'TBD', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'surveyQuestion10':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'correction_idea', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('surveyQuestion10', senderName);
      FlowUpdate = {
        current_pos: 'surveyQuestion10', open_question: 'false', prev_pos: 'surveyQuestion10', next_pos: 'noJoinCommunity', survey_done: params.currentEntity,
      };
      reminderToContinueOn = true;
      break;

    case 'noJoinCommunity':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'join_community', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('noJoinCommunity', senderName);
      FlowUpdate = {
        current_pos: 'noJoinCommunity', open_question: true, prev_pos: undefined, next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', survey_done: 'yes',
      };
      reminderToContinueOn = false;
      break;

    case 'yesJoinCommunity':
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, 'join_community', params.rawUserInput, true);
      API.createSurveyCollection(message.sender.id);
      reply = standardReplies('yesJoinCommunity', senderName);
      FlowUpdate = {
        current_pos: 'yesJoinCommunity', open_question: true, prev_pos: undefined, next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', survey_done: 'yes',
      };
      reminderToContinueOn = false;
      break;

    case 'reliefOfUserContinuing':
      params.currentEntity = params.prevPos;
      const tempReply = await flows.survey(message, params, userFromDB);
      const trueReply = [tempReply.pop()];
      return reply = standardReplies('reliefOfUserContinuing', senderName).concat(trueReply);

    default:
      if (!reply) {
        console.log('No case matched and reply is undefined');
      }
  }

  if (!reply) {
    params.prevFlow = 'opentalk';
    params.currentFlow = 'opentalk';
    params.currentEntity = 'fallback';
    console.error('FLOW ERROR :: Undefined reply at Survey. Check what happened mate, this is not normal. I saved the Patria by sending the user to open conversation.');
    return await flows.opentalk(message, params, userFromDB);
  }

  /**
   * Update Flow Collection of the User in MongoDB
   * */
  if (FlowUpdate) {
    API.updateFlow(message.sender.id, FlowUpdate);
  }

  if (reminderToContinueOn) {
    waitingTime = 18000;
    if (params.currentEntity) {
      flowUpdateReminderMsg = {
        current_pos: params.currentEntity, open_question: true, next_pos: 'reliefOfUserContinuing', prev_flow: 'survey',
      };
    } else {
      flowUpdateReminderMsg = {
        current_pos: params.prevPos, open_question: true, next_pos: 'reliefOfUserContinuing', prev_flow: 'survey',
      };
    }

    if (process.env.DEBUG_MODE === 'true' || process.env.DEBUG_MODE === '1') {
      console.log('DEBUG MODE IS ENABLED - REMINDER TO COMPLETE INTRO FLOW WILL BE SENT IN 40 SECONDS INSTEAD OF NORMAL TIME');
      waitingTime = 40;
    }

    reminderReplies = standardReplies('after5HoursReminder', senderName);
    controllerSmash.CronReminder(params.currentEntity, reminderReplies, waitingTime, flowUpdateReminderMsg, message.sender.id, userFromDB);
  }

  if (willSendDelayedReply) {
    controllerSmash.CronReminder(params.currentEntity, delayedReplies, delayTime, DelayedUpdate, message.sender.id, userFromDB);
  }

  if (userMustPressButton) {
    let time = 6;
    if (params.repeatedThisPos) { time = 12; }
    controllerSmash.CronReminder(params.currentPos, delayedReplies, time, DelayedUpdate, message.sender.id, userFromDB);
    return;
  }
  return await reply;
};

module.exports = getReply;

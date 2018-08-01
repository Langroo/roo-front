const getReply = async (message, params, userFromDB) => {

  // Requirementes and imports of external modules and libraries
  const API = require('../../api/index').dbApi
  const standardReplies = require('./responses').standardReplies
  const langNames = require('./languages')
  const OneForAll = require('../../bot-tools').OneForAll
  const BotCache = require('../../bot-tools').BotCache

  // -- Instantiations
  const controllerSmash = new OneForAll()

  // Variables
  const flows = require('../index')
  const reminderReplies = require('../index').reminderReplies
  let reply, replyTranslated, FlowUpdate, willCreateUser, DelayedUpdate, reminderToContinueOn,
    delayedReplies, userLanguage, userSpeaksEnglish, langVar, userMustPressButton, dontTranslateThisRegex

  // -- Seconds before sending a reminder or a delayed reply
  let waitingTime

  // -- Messages positions to skip from translating
  const skipTranslationIndex = []

  // -- Variable to control which dialogs will be translated
  let translateActive = params.translateDialog
  if (userFromDB.data) {
    userLanguage = userFromDB.data.language.substr(0, 2)
    userSpeaksEnglish = userLanguage === 'en'
  } else {
    userLanguage = 'en'
    userSpeaksEnglish = true
  }

  /**
   * Replies in case of unexpected user input during a button guided question
   * Every message here has the open_question parameter set to false
   * */

  if (params.rawUserInput === 'start_other_language') {
    translateActive = true
  }
  if (params.currentEntity === undefined && params.OpQ) {
    params.currentEntity = params.currentPos
  } else if (params.currentEntity === undefined && !params.OpQ) {

    langVar = langNames(userLanguage)
    langVar = langVar.charAt(0).toUpperCase() + langVar.slice(1)
    userMustPressButton = true
    DelayedUpdate = { current_pos: params.prevPos, open_question: 'false', prev_pos: params.prevPos, next_pos: 'TBD', prev_flow: 'introduction', repeated_this_pos: '1' }
    if (params.repeatedThisPos === '0') {
      delayedReplies = reminderReplies('pressBtnFirstReminder', params.senderName, langVar).concat(standardReplies(params.prevPos, params.senderName, langVar).pop())
    } else {
      delayedReplies = reminderReplies('pressBtnSecondReminder', params.senderName, langVar).concat(standardReplies(params.prevPos, params.senderName, langVar).pop())
    }
    if (userLanguage !== 'en' && translateActive) {
      delayedReplies = await controllerSmash.translateReply(delayedReplies, userLanguage)
    }
      // -- Initialize reply as empty to avoid No-Reply autoresponder trigger
    reply = []

  }

  if (params.currentEntity === 'determineLanguage') {
    if (userSpeaksEnglish) {
      params.currentEntity = 'askWhoIsRoo'
    } else {
      params.currentEntity = 'userSpeakLanguage'
    }
  }

  // -- Create basic account in DB for new - unregistered users
  if (!userFromDB.data) { await API.createInitialUserProfile(message.sender.id, message.conversation) }

  /* ******************************************************************************************************************************************************
   * ************************************ Replies to user input according to pre-programmed flow **********************************************************
   * ******************************************************************************************************************************************************/

  switch (params.currentEntity) {

  case 'getStarted':
    reply = standardReplies('getStarted', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'getStarted', open_question: true, prev_pos: 'getStarted', next_pos: 'introDialog2', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'introDialog2':
    reply = standardReplies('introDialog2', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog2', open_question: true, prev_pos: 'introDialog2', next_pos: 'introDialog3', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'introDialog3':
    reply = standardReplies('introDialog3', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog3', open_question: true, prev_pos: 'introDialog3', next_pos: 'introDialog4', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'introDialog4':
    reply = standardReplies('introDialog4', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog4', open_question: 'false', prev_pos: 'introDialog4', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'introDialog4Branch1':
    reply = standardReplies('introDialog4Branch1', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog4Branch1', open_question: true, prev_pos: 'introDialog4Branch1', next_pos: 'introDialog5', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'introDialog5':
    reply = standardReplies('introDialog5', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog5', open_question: 'false', prev_pos: 'introDialog5', next_pos: 'introDialog6', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'introDialog6':
    reply = standardReplies('introDialog6', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog4Branch1', open_question: 'false', prev_pos: 'introDialog6', next_pos: 'introDialog7', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'introDialog7':
    reply = standardReplies('introDialog7', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'introDialog7', open_question: true, prev_pos: 'introDialog7', next_pos: 'introFinal', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'introFinal':
    if (params.tutorFlowStatus === 'requested') {
      reply = standardReplies('jumpToTutorFlow', params.senderName)
      willCreateUser = true
      reminderToContinueOn = false
      FlowUpdate = { current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'OpenTalk', prev_flow: 'introduction', repeated_this_pos: '0' }

    } else {
      reply = standardReplies('introFinal', params.senderName)
      willCreateUser = true
      reminderToContinueOn = false
      FlowUpdate = { current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'OpenTalk', prev_flow: 'content', repeated_this_pos: '0' }
    }
    break

  case 'introAltFinal':
    reply = standardReplies('introAltFinal', params.senderName)
    reminderToContinueOn = false
    FlowUpdate = { current_pos: 'introAltFinal', open_question: 'false', prev_pos: 'introAltFinal', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'content', repeated_this_pos: '0' }
    break

  case 'reliefOfUserContinuing':
    params.currentEntity = params.prevPos
    const tempReply = await flows.introduction(message, params, userFromDB)
    const trueReply = [tempReply.pop()]
    return reply = standardReplies('reliefOfUserContinuing', params.senderName).concat(trueReply)

  default:
    if (!reply) {
      console.info('❌ No case matched, reply at Introduction Context Undefined ¯\\_(ツ)_/¯')
    }
  }

  if (!reply) {
    params.currentEntity = 'fallback'
    params.prevFlow = 'fallback'
    reply = await flows.OpenTalk(message, params, userFromDB)
    if (userLanguage !== 'en') {
      for (let i = 0; i < reply.length; i++) {
        if (reply[i].type === 'text') {
          replyTranslated = await controllerSmash.translateReply(reply, userLanguage)
          reply[i].content = replyTranslated.text
        }
      }
    }
    return reply
  }

  /**
   * Update Flow Collection of the User in MongoDB
   * */

  if (willCreateUser) {
    const r = await API.createFullUserProfile(message.sender.id)
    if (r.statusCode >= 200 && r.statusCode < 300) { console.info('User Profile Created in [APIDB] Successfully') } else { console.error('ERROR :: User Profile Creation after INTRODUCTION has been UNSUCCESSFUL') }
    await API.updateContext(message.sender.id, { finished_flows: 'introduction' })
  }

  if (reminderToContinueOn) {
    waitingTime = 18000
    if (process.env.DEBUG_MODE === 'true' || process.env.DEBUG_MODE === '1') {
      console.log('DEBUG MODE IS ENABLED - REMINDER TO COMPLETE INTRO FLOW WILL BE SENT IN 40 SECONDS INSTEAD OF NORMAL TIME')
      waitingTime = 40
    }
    const data = {
      senderId: message.sender.id,
    }

    controllerSmash.killCronJob(params.prevPos, message.sender.id)

    /*
    * In the particular case that the user talks for the first time to the bot and does not continue
    * the conversation, we will send as the reminder the next message/dialog
    * */
    if (params.currentEntity === 'getStarted') {
      FlowUpdate = Object.assign({}, FlowUpdate, { current_pos: 'introDialog2' })
      params.currentEntity = 'introDialog2'
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB)
    } else {
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.sender.id, userFromDB)
    }
    /* Comment this function is not ready*/
    // controllerSmash.apiCronReminder('user/createReminder', data, null)
  }

  if (userLanguage !== 'en' && translateActive) {
    reply = await controllerSmash.translateReply(reply, userLanguage, skipTranslationIndex, dontTranslateThisRegex)
  }

  if (userMustPressButton) {
    let time = 6
    if (params.repeatedThisPos) { time = 10 }
    controllerSmash.CronReminder(params.currentPos, delayedReplies, time, DelayedUpdate, message.sender.id, userFromDB)
    return
  }

  // -- Update REDIS flow control variables
  if (FlowUpdate) {
    API.updateFlow(message.sender.id, FlowUpdate)
  }

  return await reply
}

module.exports = getReply

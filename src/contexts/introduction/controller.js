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
  let skipTranslationIndex = []

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
  if (!userFromDB.data) { await API.createInitialUserProfile(message.senderId, message.conversation) }

  /* ******************************************************************************************************************************************************
   * ************************************ Replies to user input according to pre-programmed flow **********************************************************
   * ******************************************************************************************************************************************************/

  switch (params.currentEntity) {

  case 'getStarted':
    reply = standardReplies('getStarted', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'getStarted', open_question: true, prev_pos: 'getStarted', next_pos: 'howAreYouReply', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'howAreYouReply':
    reply = standardReplies('howAreYouReply', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'howAreYouReply', open_question: true, prev_pos: 'howAreYouReply', next_pos: 'determineLanguage', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: 'false' }
    break

  case 'userSpeakLanguage':
    skipTranslationIndex = [0, 1]
    langVar = langNames(userLanguage)
    langVar = langVar.charAt(0).toUpperCase() + langVar.slice(1)
    reply = standardReplies('userSpeakLanguage', params.senderName, langVar)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'userSpeakLanguage', open_question: 'false', prev_pos: 'userSpeakLanguage', next_pos: 'askWhoIsRoo', current_flow: 'introduction', prev_flow: 'introduction' }
    translateActive = true
    break

  case 'askWhoIsRoo':
    if (params.prevPos === 'userSpeakLanguage') {
      reply = standardReplies('askWhoIsRoo', params.senderName)
    } else {
      reply = standardReplies('askWhoIsRoo', params.senderName)
    }
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'askWhoIsRoo', open_question: true, prev_pos: 'askWhoIsRoo', next_pos: 'rooIntroduction', current_flow: 'introduction', prev_flow: 'introduction', translate_dialog: translateActive }
    break

  case 'rooIntroduction':
    reply = standardReplies('rooIntroduction', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooIntroduction', open_question: 'false', prev_pos: 'rooIntroduction', next_pos: 'tellHowRooCanHelp', current_flow: 'introduction', prev_flow: 'introduction' }
    break

  case 'tellHowRooCanHelp':
    reply = standardReplies('tellHowRooCanHelp', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'tellHowRooCanHelp', open_question: true, prev_pos: 'tellHowRooCanHelp', next_pos: 'whyRooIsDifferent', current_flow: 'introduction', prev_flow: 'introduction' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      .catch(err => console.error('Error saving accent at intro flow in redis :: ', err))
    if (params.rawUserInput === 'uk_accent_opt') { await API.updateAccent(message.senderId, { accent: 'uk' }) } else { await API.updateAccent(message.senderId, { accent: 'us' }) }
    break

  case 'whyRooIsDifferent':
    reply = standardReplies('whyRooIsDifferent', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'whyRooIsDifferent', open_question: true, prev_pos: 'whyRooIsDifferent', next_pos: 'whatRooTeaches', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    break

  case 'whatRooTeaches':
    let userAccent = 'accent you chose'
    await API.getUserFromRedis(message.userHash)
      .catch(() => userAccent = 'accent you chose')
      .then((res) => userAccent = res.data.accent)
    userAccent === 'us' ? userAccent = 'United States' : userAccent = 'United Kingdom'
    reply = standardReplies('whatRooTeaches', params.senderName, userAccent)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'whatRooTeaches', open_question: true, prev_pos: 'whatRooTeaches', next_pos: 'willAskQuestions', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    break

  case 'willAskQuestions':
    reply = standardReplies('willAskQuestions', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'willAskQuestions', open_question: true, prev_pos: 'willAskQuestions', next_pos: 'rooAgeQuestion', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    break

  case 'rooAgeQuestion':
    reply = standardReplies('rooAgeQuestion', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooAgeQuestion', open_question: 'false', prev_pos: 'rooAgeQuestion', next_pos: 'rooLocationQuestion', current_flow: 'introduction', prev_flow: 'introduction' }
    break

  case 'rooLocationQuestion':
    reply = standardReplies('rooLocationQuestion', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooLocationQuestion', open_question: 'false', prev_pos: 'rooLocationQuestion', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooSpecifyLocation':
    reply = standardReplies('rooSpecifyLocation', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooSpecifyLocation', open_question: true, prev_pos: 'rooSpecifyLocation', next_pos: 'rooBigMotivQuestion', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooSpecifyInfluencer':
    reply = standardReplies('rooSpecifyInfluencer', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooSpecifyInfluencer', open_question: true, prev_pos: 'rooSpecifyInfluencer', next_pos: 'rooBigMotivQuestion', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooBigMotivQuestion':
    reply = standardReplies('rooBigMotivQuestion', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooBigMotivQuestion', open_question: 'false', prev_pos: 'rooBigMotivQuestion', next_pos: 'rooEnglishLevelQuestion', current_flow: 'introduction', prev_flow: 'introduction' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooOtherMotivation':
    reply = standardReplies('rooOtherMotivation', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooOtherMotivation', open_question: true, prev_pos: 'rooOtherMotivation', next_pos: 'rooEnglishLevelQuestion', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    break

  case 'rooEnglishLevelQuestion':
    reply = standardReplies('rooEnglishLevelQuestion', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooEnglishLevelQuestion', open_question: 'false', prev_pos: 'rooEnglishLevelQuestion', next_pos: 'rooTwoSecrets', current_flow: 'introduction', prev_flow: 'introduction' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooBigInterest':
    reply = standardReplies('rooBigInterest', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooBigInterest', open_question: 'false', prev_pos: 'rooBigInterest', next_pos: 'introFinal', current_flow: 'introduction', prev_flow: 'introduction' }
    await BotCache.saveUserDataCache(message.senderId, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
    break

  case 'rooOtherInterest':
    reply = standardReplies('rooOtherInterest', params.senderName)
    reminderToContinueOn = true
    FlowUpdate = { current_pos: 'rooOtherInterest', open_question: true, prev_pos: 'rooOtherInterest', next_pos: 'introFinal', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
    break

  case 'introFinal':
    if (params.tutorFlowStatus === 'requested') {
      reply = standardReplies('jumpToTutorFlow', params.senderName)
      FlowUpdate = { current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'introduction', repeated_this_pos: '0' }
      willCreateUser = true
      reminderToContinueOn = false

    } else {
      reply = standardReplies('introFinal', params.senderName)
      willCreateUser = true
      reminderToContinueOn = false
      FlowUpdate = { current_pos: 'introFinal', open_question: 'false', prev_pos: 'introFinal', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'content', repeated_this_pos: '0' }
    }
    break

  case 'introAltFinal':
    reply = standardReplies('introAltFinal', params.senderName)
    reminderToContinueOn = false
    FlowUpdate = { current_pos: 'introAltFinal', open_question: 'false', prev_pos: 'introAltFinal', next_pos: 'TBD', current_flow: 'introduction', prev_flow: 'content', repeated_this_pos: '0' }
    break

  case 'introStartLater':
    reply = standardReplies('introStartLater', params.senderName)
    willCreateUser = true
    reminderToContinueOn = false
    FlowUpdate = { current_pos: 'introStartLater', open_question: true, prev_pos: 'fallback', next_pos: 'fallback', current_flow: 'OpenTalk', prev_flow: 'OpenTalk', repeated_this_pos: '0' }
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
    const r = await API.createFullUserProfile(message.senderId)
    if (r.statusCode >= 200 && r.statusCode < 300) { console.info('User Profile Created in [APIDB] Successfully') } else { console.error('ERROR :: User Profile Creation after INTRODUCTION has been UNSUCCESSFUL') }
    await API.updateContext(message.senderId, { finished_flows: 'introduction' })
  }

  if (reminderToContinueOn) {
    waitingTime = 18000
    if (process.env.DEBUG_MODE === 'true' || process.env.DEBUG_MODE === '1') {
      console.log('DEBUG MODE IS ENABLED - REMINDER TO COMPLETE INTRO FLOW WILL BE SENT IN 40 SECONDS INSTEAD OF NORMAL TIME')
      waitingTime = 40
    }
    const data = {
      senderId: message.senderId,
    }

    controllerSmash.killCronJob(params.prevPos, message.senderId)

    /*
    * In the particular case that the user talks for the first time to the bot and does not continue
    * the conversation, we will send as the reminder the next message/dialog
    * */
    if (params.currentEntity === 'getStarted') {
      FlowUpdate = Object.assign({}, FlowUpdate, { current_pos: 'howAreYouReply'})
      params.currentEntity = 'howAreYouReply'
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.senderId, userFromDB)
    } else {
      controllerSmash.CronReminder(params.currentEntity, standardReplies('gifForReminder', params.senderName).concat(standardReplies(params.currentEntity, params.senderName).pop()), waitingTime, FlowUpdate, message.senderId, userFromDB)
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
    controllerSmash.CronReminder(params.currentPos, delayedReplies, time, DelayedUpdate, message.senderId, userFromDB)
    return
  }

  // -- Update REDIS flow control variables
  if (FlowUpdate) {
    API.updateFlow(message.senderId, FlowUpdate)
  }

  return await reply
}

module.exports = getReply

const getReply = async (message, params, userFromDB) => {

  // -- Requires and imports of external modules and libraries
  const API = require('../../api/index').dbApi
  const axios = require('axios')
  const standardReplies = require('./responses').standardReplies
  const failsafeReplies = require('./responses').failsafeReplies
  const OneForAll = require('../../bot-tools').OneForAll
  const BotCache = require('../../bot-tools').BotCache
  const flows = require('../index')

  // -- Instantiations
  const controllerSmash = new OneForAll()

  // -- Variable declaration
  let reply
  let futureMsgTime = 10800
  let userLevel
  let flowControlUpdate
  let futureMsgFlowUpdate
  let reminderToContinueOn
  let futureRepliesToSend
  let tempReply
  let trueReply
  let tutorOpsUrl
  const preTutorAux = {}
  let sendIForgotDialog = false
  let tutorCRMLink
  const tutorEntities = ['initiateTutorFlow', 'tb0', 'describeYourself', 'describeYourInterests', 'whenToCallTutor', 'confirmWhenToCallTutor', 'whenToCallTutor2', 'daysGroupForCalls', 'daysToCallTutor', 'knowThePrice', 'tutorFlowFinished', 'PTshowPrices', 'PTtellUserNow', 'PTneverRemindUser', 'PTnextWeekOrMonth', 'initiatePreTutorFlow', 'initiateUpsellingFlow']

  // -- DEFINE THE TUTOR CRM URLS TO SEND TO SLACK DEPENDING ON ENVIRONMENT
  if (process.env.NODE_ENV === 'develop') {
    tutorOpsUrl = process.env.BOT_NOTIFICATIONS_SLACK_URL
    tutorCRMLink = 'https://docs.google.com/spreadsheets/d/1jDbo7Bo5J8hTYM_idcGvBZ0EvoDfTfMSrOnd2a-GCMs/edit#gid=1711779857'
  } else if (process.env.NODE_ENV === 'quality') {
    tutorOpsUrl = process.env.BOT_NOTIFICATIONS_SLACK_URL
    tutorCRMLink = 'https://docs.google.com/spreadsheets/d/1R0CkLKvW6Eyy3prOMLnXZpkoNmDq1eLXIvCogHuRZvg/edit#gid=1711779857'
  } else if (process.env.NODE_ENV === 'production') {
    tutorOpsUrl = process.env.TUTOR_OPS_SLACK_URL
    tutorCRMLink = 'https://docs.google.com/spreadsheets/d/1o-9dmt0THrWPtrALbTo96dJFd-AauSNjTwGIf0Fdz1Q/edit#gid=1711779857'
  } else {
    tutorCRMLink = 'Tutor CRM GoogleSheet'
  }

  // -- Define variables with sender's first name and full name
  const senderName = params.senderName
  const userFullName = params.fullName

  // -- Is user allowed to request a tutor yet?
  if (userFromDB.data) {
    if (params.prevFlow === 'introduction' && params.currentEntity !== 'fromIntroPreTutorFlow') {
      params.currentEntity = params.currentPos
      await API.updateFlow(message.sender.id, { tutor_flow_status: 'requested' })
      const tempReply = await flows.introduction(message, params, userFromDB)
      const trueReply = [tempReply.pop()]
      return reply = [standardReplies('mustRegisterFirst', senderName)[0]].concat(trueReply)
    }
    if (userFromDB.content) { preTutorAux.accent = userFromDB.content.plan.accent }
    userLevel = 1
  } else {
    console.info(`${userFullName} does not have an account with us. Sending him to the intro flow as God commands`)
    params.currentEntity = 'askWhoIsRoo'
    const tempReply = await flows.introduction(message, params, userFromDB)
    const trueReply = [tempReply.pop()]
    return reply = [standardReplies('mustRegisterFirst', senderName)[1]].concat(trueReply)
  }
  // -- Check if the user already did the tutor flow
  if (params.tutorFlowStatus === 'finished') {
    userLevel = 2
  }

  // -- Conditionals for undefined entities, open questions or continuing the flow
  if (params.currentEntity === 'continueTutorFlow') {
    params.currentEntity = params.currentPos
    if (tutorEntities.indexOf(params.currentEntity) === -1) {
      params.currentEntity = 'initiateTutorFlow'
      sendIForgotDialog = true
    }
  } else if (params.currentEntity === undefined && params.OpQ) {
    params.currentEntity = params.currentPos
  } else if (params.currentEntity === undefined && !params.OpQ) {
    if (params.currentPos === 'initiateTutorFlow') {
      params.prevFlow = 'opentalk'
      params.currentFlow = 'opentalk'
      params.currentEntity = 'fallback'
      return await flows.opentalk(message, params, userFromDB)
    }
    params.currentEntity = params.currentPos
    let tempReply = standardReplies(params.currentEntity, senderName)
    if (!tempReply) { tempReply = preTutorReplies(params.currentEntity, senderName) }
    const trueReply = [tempReply.pop()]
    reply = failsafeReplies('pressAButton', senderName)[Math.floor(Math.random() * failsafeReplies('pressAButton', senderName).length)]
    return reply.concat(trueReply)
  }

  if (userLevel === 1) { 
    switch (params.currentEntity) {
    /* ******************************************************************************************************
     * ********************************* Upselling Tutor Flow Section  **************************************
     * ******************************************************************************************************/
    case 'exploreTutorFlow':
      flowControlUpdate = { current_pos: 'exploreTutorFlow', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('exploreTutorFlow', senderName)
      break

    case 'badConnection':
      flowControlUpdate = { current_pos: 'badConnection', open_question: 'false', next_pos: 'badConnection', prev_flow: 'tutor' }
      reply = standardReplies('badConnection', senderName)
      break

    case 'goodConnection':
      flowControlUpdate = { current_pos: 'goodConnection', open_question: 'false', next_pos: 'goodConnection', prev_flow: 'tutor' }
      reply = standardReplies('goodConnection', senderName)
      break

    case 'maleTutor':
      flowControlUpdate = { current_pos: 'maleTutor', open_question: 'false', next_pos: 'maleTutor', prev_flow: 'tutor' }
      reply = standardReplies('maleTutor', senderName)
      break

    case 'femaleTutor':
      flowControlUpdate = { current_pos: 'femaleTutor', open_question: 'false', next_pos: 'femaleTutor', prev_flow: 'tutor' }
      reply = standardReplies('femaleTutor', senderName)
      break

    case 'eitherTutor':
      flowControlUpdate = { current_pos: 'eitherTutor', open_question: 'false', next_pos: 'eitherTutor', prev_flow: 'tutor' }
      reply = standardReplies('eitherTutor', senderName)
      break

    case 'userCannotPay':
      flowControlUpdate = { current_pos: 'userCannotPay', open_question: 'false', next_pos: 'userCannotPay', prev_flow: 'tutor' }
      reply = standardReplies('userCannotPay', senderName)
      break

    case 'userCanPay':
      flowControlUpdate = { current_pos: 'userCanPay', open_question: 'false', next_pos: 'userCanPay', prev_flow: 'tutor' }
      reply = standardReplies('userCanPay', senderName)
      break

    case 'haveQuestion':
      flowControlUpdate = { current_pos: 'haveQuestion', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('haveQuestion', senderName)
      break

    case 'haveNotQuestion':
      flowControlUpdate = { current_pos: 'haveNotQuestion', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('haveNotQuestion', senderName)
      break

    case 'tb0':
      reply = standardReplies('startingTutorFlow', senderName)
      flowControlUpdate = { current_pos: 'tb0', open_question: true, next_pos: 'tutorAskCountryOfUser', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0', tutor_flow_status: 'requested' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS_SLACK_URL, `{"text":"User ${userFullName} is *Requesting a native tutor*"}`, 'Tutor Request Flow Initiated')
      reminderToContinueOn = true
      break

    case 'tutorAskCountryOfUser':
      reply = standardReplies('tutorAskCountryOfUser', senderName)
      flowControlUpdate = { current_pos: 'tutorAskCountryOfUser', prev_pos: 'tutorAskCountryOfUser', open_question: true, next_pos: 'describeYourself', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      reminderToContinueOn = true
      break

    case 'describeYourself':
      reply = standardReplies('describeYourself', senderName)
      flowControlUpdate = { current_pos: 'describeYourself', prev_pos: 'describeYourself', open_question: true, next_pos: 'describeYourInterests' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break

    case 'describeYourInterests':
      reply = standardReplies('describeYourInterests', senderName)
      flowControlUpdate = { current_pos: 'describeYourInterests', prev_pos: 'describeYourInterests', open_question: true, next_pos: 'whenToCallTutor', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break

    case 'whenToCallTutor':
      reply = standardReplies('whenToCallTutor', senderName)
      flowControlUpdate = { current_pos: 'whenToCallTutor', prev_pos: 'whenToCallTutor', open_question: 'false', next_pos: 'confirmWhenToCallTutor', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break

    case 'confirmWhenToCallTutor':
      reply = standardReplies('confirmWhenToCallTutor', senderName)
      flowControlUpdate = { current_pos: 'confirmWhenToCallTutor', prev_pos: 'confirmWhenToCallTutor', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break
    case 'whenToCallTutor2':
      reply = standardReplies('whenToCallTutor2', senderName)
      flowControlUpdate = { current_pos: 'whenToCallTutor2', prev_pos: 'confirmWhenToCallTutor', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      break

    case 'daysGroupForCalls':
      reply = standardReplies('daysGroupForCalls', senderName)
      flowControlUpdate = { current_pos: 'daysGroupForCalls', prev_pos: 'daysGroupForCalls', open_question: 'false', next_pos: 'knowThePrice', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      if (params.rawUserInput === 'TFB_NO_ADD') {
        await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      } else {
        const userFromRedis = await API.getUserFromRedis(message.userHash)
          .catch(() => console.error('Could not get user from Redis to add second tutorCallDaytime'))
        let tutorCallDaytime
        if (userFromRedis) {
          tutorCallDaytime = userFromRedis.data.timeOfDayForCalls
          tutorCallDaytime = `${tutorCallDaytime},${params.rawUserInput}`
          await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, tutorCallDaytime)
        }
      }
      reminderToContinueOn = true
      break
      
    case 'internetSpeedDescription':
      reply = standardReplies('internetSpeedDescription', senderName)
      flowControlUpdate = { current_pos: 'internetSpeedDescription', prev_pos: 'internetSpeedDescription', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break

    case 'knowThePrice':
      reply = standardReplies('knowThePrice', senderName)
      flowControlUpdate = { current_pos: 'knowThePrice', prev_pos: 'knowThePrice', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor', current_flow: 'tutor', repeated_this_pos: '0' }
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('askUserToContinue', senderName)
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.prevPos, params.rawUserInput)
      reminderToContinueOn = true
      break

    case 'userCanPayForTutor':
      await API.createTutorRequest(message.userHash)
      reply = standardReplies('userCanPayForTutor', senderName)
      flowControlUpdate = { current_pos: 'userCanPayForTutor', open_question: true, next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', repeated_this_pos: '0', tutor_flow_status: 'finished' }
      try {
        axios.request({
          headers: { 'Content-Type': 'application/json' },
          url: tutorOpsUrl,
          method: 'post',
          data: `{"text":"User ${userFullName} finished the *Tutor Request*. It's a possible Customer.\nSee ${userFullName}'s answers at ${tutorCRMLink}"}`,
        })
        console.log('User finished tutor flow')
      } catch (reason) {
        console.log('An error occurred while sending message to Slack of Finished Tutor Flow :: ', reason)
        break
      }
      break

    case 'userHasNoMoney':
      await API.createTutorRequest(message.userHash)
      reply = standardReplies('userHasNoMoney', senderName)
      flowControlUpdate = { current_pos: 'userHasNoMoney', open_question: true, next_pos: 'tutorFlowFinished', prev_flow: 'opentalk', current_flow: 'opentalk', tutor_flow_status: 'finished' }
      await BotCache.saveUserDataCache(message.sender.id, message.userHash, params.currentFlow, params.currentEntity, params.rawUserInput)
      break

    case 'willDoTutorLater':
      reply = standardReplies('willDoTutorLater', senderName)
      if (params.prevFlow === 'introduction') {
        futureMsgTime = 6
        params.currentEntity = params.prevPos
        params.repeatedThisPos = '1'
        tempReply = await flows.introduction(message, params, userFromDB)
        trueReply = [tempReply.pop()]
        futureRepliesToSend = failsafeReplies('lostInConversation', senderName)[Math.floor(Math.random() * failsafeReplies('lostInConversation', senderName).length)]
        futureRepliesToSend = futureRepliesToSend.concat(trueReply)
        reminderToContinueOn = true
      } else if (params.prevFlow === 'content') {
        futureMsgTime = 6
        params.currentEntity = 'retakeLesson'
        params.repeatedThisPos = '1'
        tempReply = await flows.content(message, params, userFromDB)
        trueReply = [tempReply.pop()]
        futureRepliesToSend = failsafeReplies('lostInConversation', senderName)[Math.floor(Math.random() * failsafeReplies('lostInConversation', senderName).length)]
        futureRepliesToSend = futureRepliesToSend.concat(trueReply)
        reminderToContinueOn = true
      } else {
        flowControlUpdate = { current_pos: 'fallback', open_question: true, next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk' }
        reminderToContinueOn = false
      }
      break

    default:
      console.log('No case matched in tutor flow')
    }
  } else if (userLevel === 2) {
    reply = [standardReplies('tutorFlowFinished', senderName)[Math.floor(Math.random() * standardReplies('tutorFlowFinished', senderName).length)]]
  }

  // -- Emergency reply in case reply is undefined in this flow
  if (!reply) {
    console.log('We got an undefined reply at tutor flow so I will send the user to the Open Conversation ʘ‿ʘ')
    params.currentEntity = 'fallback'
    params.prevFlow = 'fallback'
    reply = await flows.opentalk(message, params, userFromDB)
  }

  // -- Controller of the position of the user in the conversation
  if (flowControlUpdate) {
    API.updateFlow(message.sender.id, flowControlUpdate)
  }

  // -- Delayed reply
  if (reminderToContinueOn) {
    if (process.env.DEBUG_MODE === 'true' || process.env.DEBUG_MODE === '1') {
      futureMsgTime = 40
    }
    controllerSmash.CronReminder(params.currentEntity, futureRepliesToSend, futureMsgTime, futureMsgFlowUpdate, message.sender.id, userFromDB)
  }

  return reply
}

module.exports = getReply

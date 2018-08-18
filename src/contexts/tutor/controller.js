const getReply = async (message, params, userFromDB) => {

  // -- Requires and imports of external modules and libraries
  const API = require('../../core/index').dbApi
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
  let tutorCRMLink
  const tutorEntities = ['exploreTutorFlow', 'badConnection', 'goodConnection', 'maleTutor', 'femaleTutor', 'eitherTutor', 'userCannotPay', 'userCanPay']

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
    const tempReply = standardReplies(params.currentEntity, senderName)
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
      flowControlUpdate = { current_pos: 'exploreTutorFlow', prev_pos: 'exploreTutorFlow', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('exploreTutorFlow', senderName)
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('exploreTutorFlow', senderName)
      controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS_SLACK_URL, `{"text":"User ${userFullName} is *Requesting a native tutor*"}`, 'Tutor Request Flow Initiated')
      reminderToContinueOn = true
      break

    case 'badConnection':
      flowControlUpdate = { current_pos: 'badConnection', prev_pos: 'badConnection', open_question: 'false', next_pos: 'TBD', prev_flow: 'opentalk' }
      reply = standardReplies('badConnection', senderName)
      // futureMsgFlowUpdate = flowControlUpdate
      // utureRepliesToSend = standardReplies('badConnection', senderName)
      // controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS
      reminderToContinueOn = true
      break

    case 'goodConnection':
      flowControlUpdate = { current_pos: 'goodConnection', prev_pos: 'goodConnection', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('goodConnection', senderName)
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('goodConnection', senderName)
      // controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS
      reminderToContinueOn = true
      break

    case 'maleTutor':
      flowControlUpdate = { current_pos: 'maleTutor', prev_pos: 'maleTutor', open_question: 'false', next_pos: 'TDB', repeated_this_pos: '0', prev_flow: 'tutor' }
      reply = standardReplies('maleTutor', senderName)
      break

    case 'femaleTutor':
      flowControlUpdate = { current_pos: 'femaleTutor', prev_pos: 'femaleTutor', open_question: 'false', repeated_this_pos: '0', next_pos: 'TBD', prev_flow: 'tutor' }
      reply = standardReplies('femaleTutor', senderName)
      break

    case 'eitherTutor':
      flowControlUpdate = { current_pos: 'eitherTutor', prev_pos: 'eitherTutor', open_question: 'false', next_pos: 'eitherTutor', repeated_this_pos: '0', prev_flow: 'tutor' }
      reply = standardReplies('eitherTutor', senderName)
      break

    case 'userCannotPay':
      flowControlUpdate = { current_pos: 'userCannotPay', prev_pos: 'userCannotPay', open_question: 'false', next_pos: 'TBD', prev_flow: 'opentalk', repeated_this_pos: '0', tutor_flow_status: 'finished' }
      reply = standardReplies('userCannotPay', senderName)
      // futureMsgFlowUpdate = flowControlUpdate
      //   futureRepliesToSend = standardReplies('userCannotPay', senderName)
      // controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS
      reminderToContinueOn = true
      break

    case 'userCanPay':
      flowControlUpdate = { current_pos: 'userCanPay', open_question: 'false', next_pos: 'TBD', prev_flow: 'opentalk', current_flow: 'opentalk' }
      reply = standardReplies('userCanPay', senderName)
      futureMsgFlowUpdate = flowControlUpdate
      futureRepliesToSend = standardReplies('userCanPay', senderName)
      // controllerSmash.sendNotificationToSlack(process.env.BOT_NOTIFICATIONS
      reminderToContinueOn = true
      break

    // case 'haveQuestion':
    //   flowControlUpdate = { current_pos: 'haveQuestion', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
    //   reply = standardReplies('haveQuestion', senderName)
    //   break

    // case 'haveNotQuestion':
    //   flowControlUpdate = { current_pos: 'haveNotQuestion', open_question: 'false', next_pos: 'TBD', prev_flow: 'tutor' }
    //   reply = standardReplies('haveNotQuestion', senderName)
    //   break

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
    // reply = [standardReplies('tutorFlowFinished', senderName)[Math.floor(Math.random() * standardReplies('tutorFlowFinished', senderName).length)]]
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

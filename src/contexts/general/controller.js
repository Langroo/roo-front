const API = require('../../core/index').dbApi
const axios = require('axios')
const accountReplies = require('./responses').accountReplies
const paymentReplies = require('./responses').paymentReplies
const generalReplies = require('./responses').generalReplies
const translateReplies = require('./responses').translateReplies
const OneForAll = require('../../bot-tools').OneForAll
const FbAPIClass = require('../../bot-tools').FacebookAPI

// -- Instantiations
const controllerSmash = new OneForAll()

// -- Function to return to a closed context
const goToPreviousContext = async (message, params, userFromDB) => {

  // -- Define the contexts variable
  const contexts = require('../index')
  // -- Redefine the entity
  params.currentEntity = params.currentPos
  // -- Get the last message from the previous context to concatenate it with the returning message
  const lastMessageSent = await contexts[params.prevFlow](message, params, userFromDB)

  // -- Indicate that the previous pos of the previous context will be repeated
  params.repeatedThisPos = '1'

  // -- Define variables and call reminder
  let delayedRepliesToSend
  const delayedMsgTime = 15
  const trueReply = [lastMessageSent.pop()]
  delayedRepliesToSend = generalReplies('returningMessages', params.senderName)[Math.floor(Math.random() * generalReplies('returningMessages', params.senderName).length)]
  delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
  controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.currentPos, prev_pos: params.prevPos, repeated_this_pos: '1' }, message.sender.id, userFromDB)
}

// -- Prepare parameters to show the User Profile Dialog
const prepareProfile = (userFromDB) => {
  if (userFromDB.data) {
    let subscriptionDate, userProduct, userSubscriptionStatus
    try {
      userProduct = userFromDB.data.subscription.product
      switch (userProduct) {
      case '2_WEEK_FREE_FRIAL':
        userProduct = '2 Week Free Trial'
        break
      case 'CONTENT_ONLY':
        userProduct = 'Content Only Programme'
        break
      case 'CASUAL_TUTOR':
        userProduct = 'Casual Tutor Programme'
        break
      case 'STANDARD_TUTOR':
        userProduct = 'Standard Tutor Programme'
        break
      default:
        userProduct = '2 Week Free Trial'
      }
      subscriptionDate = userFromDB.data.FirstSubscriptionDate
      subscriptionDate = new Date(subscriptionDate)
      subscriptionDate = `${(subscriptionDate.getDate()).toString()}-${(subscriptionDate.getMonth() + 1).toString()}-${(subscriptionDate.getFullYear()).toString()}`
      userSubscriptionStatus = userFromDB.data.subscription.status
      return {
        userAccent: userFromDB.data.content.plan.accent,
        userLevel: userFromDB.data.content.plan.level,
        userProduct,
        userSubscriptionStatus,
        subscriptionDate,
      }
    } catch (e) {
      console.error('Error setting user profile :: ', e)
      return e
    }
  }
}

// -- Function to return the dialog according to the user input and entity
const getReply = async (message, params, userFromDB) => {

  // -- general usage variables
  const contexts = require('../index')

  // -- Variable declaration
  let flowControlUpdate, reply, currency, paymentUrl, tempReply, trueReply

  // -- Pre-initialized variables
  let wildcard = {}
  const FacebookAPI = new FbAPIClass(message.sender.id)
  const ifHereGoBack = ['generalShareDialog', 'FORTUNE_QUOTE', 'TRANSLATE_RETURNER', 'DIRECT_TRANSLATE', 'mustRegisterFirst', 'helpUser1', 'paymentDialog1', 'howToConverseMenu', 'showPricing', 'askRoo']

  // -- Define the user first name and full name
  const senderName = params.senderName
  const userFullName = params.fullName

  /**
   * Disable the following options during the following flow
   * */
  const disablingFlow = 'introduction'
  const optionsToDisable = ['helpUser_Init', 'userProfile', 'chooseNewLevel', 'chooseNewAccent']
  if (optionsToDisable.indexOf(params.currentEntity) > -1 && params.prevFlow === disablingFlow) {
    params.currentEntity = 'mustRegisterFirst'
  }

  /**
   * Conditionals to decide which replies group to send
   * */

  switch (params.currentEntity) {

  case 'RESET':

    if (params.prevFlow === 'introduction') {

      flowControlUpdate = { current_flow: 'introduction', current_pos: 'getStarted' }
      params.currentEntity = 'getStarted'
      reply = await contexts.introduction(message, params, userFromDB)

    } else if (params.prevFlow === 'tutor') {

      flowControlUpdate = { current_flow: 'tutor' }
      params.currentEntity = 'exploreTutorFlow'
      reply = await contexts.tutor(message, params, userFromDB)

    } else {

      flowControlUpdate = { current_flow: 'introduction', current_pos: 'getStarted' }
      params.currentEntity = 'getStarted'
      reply = await contexts.introduction(message, params, userFromDB)

    }
    break

  case 'sendMessageBroadcast':
    if (params.rawUserInput === 'send_monday_broadcast') {
      await API.sendBroadcastMessage('mondayBroadcastQuiz', 'UNSUBSCRIBED')
      reply = []
    } else if (params.rawUserInput === 'send_wednesday_broadcast') {
      await API.sendBroadcastMessage('wednesdayBroadcastQuiz', 'UNSUBSCRIBED')
      reply = []
    } else if (params.rawUserInput === 'send_friday_broadcast') {
      await API.sendBroadcastMessage('fridayBroadcastQuiz', 'UNSUBSCRIBED')
      reply = []
    }
    break

  case 'paymentDialog_Init': {
    const paymentInitMsg = `{"text":"User ${userFullName} has initiated the *Payment/Upgrade Plan conversational flow*"}`
    const paymentInitURL = process.env.PAYMENT_NOTIFICATIONS_SLACK_URL
    const paymentInitErr = controllerSmash.sendNotificationToSlack(paymentInitURL, paymentInitMsg)
    if (paymentInitErr) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending the notification to SLACK :: ', paymentInitErr)
    }
    flowControlUpdate = { current_pos: 'paymentDialog_Init', open_question: 'false', next_pos: 'paymentDialog1' }
    reply = paymentReplies('paymentDialog_Init', senderName, {})
    break
  }
  case 'paymentDialog1':
    currency = params.rawUserInput.substr(0, 3)
    paymentUrl = {
      casualURL: `${process.env.API_BASE_URL}/payment/casual/${message.sender.id}/${currency}`,
      standardURL: `${process.env.API_BASE_URL}/payment/standard/${message.sender.id}/${currency}`,
      eliteURL: `${process.env.API_BASE_URL}/payment/elite/${message.sender.id}/${currency}`,
      currency,
    }
    flowControlUpdate = { open_question: 'false', next_pos: 'TBD', prev_pos: 'paymentDialog1', current_flow: 'general' }
    reply = paymentReplies('paymentDialog1', senderName, paymentUrl)
    break

  case 'paymentHelpDialog':
    reply = paymentReplies('paymentHelpDialog', senderName, {})
    break

  case 'paymentDialog_Final':
    reply = paymentReplies('paymentDialog_Final', senderName, {})
    break

  case 'generalShareDialog':
    reply = generalReplies('generalShareDialog', senderName)
    break

  case 'inboxMode':
    flowControlUpdate = { current_pos: 'inboxMode', prev_pos: 'inboxMode', open_question: 'false', current_flow: 'inboxMode' }
    try {
      await FacebookAPI.HandoverSwitch(0)
    } catch (error) {
      console.log('Error putting the user in Inbox Mode')
    }
    console.info('\nInbox Mode Enabled - Control of the bot is now in the hands of the admin\n')
    break

  case 'askRoo': {
    const askRooMsg = `{"text":"*User ${userFullName} asks:* ${params.rawUserInput}", "icon_emoji": ":question:", "username": "Ask Roo"}`
    const askRooURL = 'https://hooks.slack.com/services/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'
    const askRooErr = controllerSmash.sendNotificationToSlack(askRooURL, askRooMsg, 'User is making a question')
    if (askRooErr) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending question to SLACK :: ', askRooErr)
    }
    reply = [generalReplies('askRoo', senderName)[Math.floor(Math.random() * generalReplies('askRoo', senderName).length)]]
    break
  }

  case 'pronounceThis': {
    let textToAudio
    let actualText = params.rawUserInput.toLowerCase()
    actualText = actualText.split('pronounce ')[1]
    if (userFromDB.data) {
      if (userFromDB.data.gender && userFromDB.data.content) {
        textToAudio = await controllerSmash.textToAudio(actualText, message.sender.id, userFromDB.data.gender, userFromDB.data.content.plan.accent)
      } else {
        textToAudio = await controllerSmash.textToAudio(actualText, message.sender.id)
      }
    } else {

      textToAudio = await controllerSmash.textToAudio(actualText, message.sender.id)
    }
    if (textToAudio) {
      const error = await FacebookAPI.SendMessages('audio', textToAudio)
      if (!error) {
        reply = []
      } else {
        reply = [{
          type: 'text',
          content: `I am sorry😫 ${senderName}, my throat is a bit sore right now 😖... Try again ☝ later and I will send you a voice note 📢 with the pronunciation of that.`,
        }]
      }

    } else {
      reply = [{
        type: 'text',
        content: `I am sorry😫 ${senderName}, my throat is a bit sore right now 😖... Try again ☝ later and I will send you a voice note 📢 with the pronunciation of that.`,
      }]
    }
    break
  }

  case 'mustRegisterFirst':
    params.currentEntity = params.currentPos
    tempReply = await contexts.introduction(message, params, userFromDB)
    trueReply = [tempReply.pop()]
    return reply = generalReplies('mustRegisterFirst', senderName).concat(trueReply)

  // -- Function triggered by the STOP ALL CONVERSATION in the menu and the DELETE ACCOUNT
  case 'stopBotMessages':
    await API.deleteUser(message.sender.id)
      .catch((err) => console.log('ERROR UNSUBSCRIBING USER :: ', err))
    flowControlUpdate = { prev_pos: 'stopBotMessages', open_question: 'false', next_pos: 'fallback', current_flow: 'opentalk' }
    reply = generalReplies('stopBotMessages', senderName)
    break

  case 'resetFlowForUser':
    let userSenderId = params.rawUserInput.split('[')[1].split(']')[0]
    if ((/me/i).test(userSenderId)) {
      userSenderId = message.sender.id
      await API.createFullUserProfile(userSenderId)
      await API.sendLesson(userSenderId)
      reply = [{ type: 'text', content: 'Content restarted for you ( ˘ ³˘)♥ ' }]
    } else if (!(/[0-9]+/).test(userSenderId)) {
      reply = [{ type: 'text', content: 'This user doesn\'t exist 😕 or you sent me something that is not a senderId 😡' }]
    } else {
      let targetUser = (await API.retrieveUser(userSenderId)).data
      if (targetUser.data) {
        targetUser = targetUser.data.name.short_name
        reply = [{ type: 'text', content: `I restarted her ${targetUser} ʕᵔᴥᵔʔ` }]
        await API.updateFlow(userSenderId, { current_flow: 'opentalk', prev_flow: 'opentalk', current_pos: 'fallback' })
        const r = await API.createFullUserProfile(userSenderId)
        if (r.statusCode >= 200 && r.statusCode < 300) { console.info('User Profile Created in [APIDB] Successfully') } else { console.error('ERROR :: User Profile Creation after INTRODUCTION has been UNSUCCESSFUL') }
      } else {
        reply = [{ type: 'text', content: 'Could not restart content for this user, check the logs {•̃_•̃ } ' }]
      }
    }
    break

  case 'continueCurrentFlow':
    if (params.prevFlow === 'introduction') {
      params.currentEntity = params.prevPos
      reply = await contexts.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'tutor') {
      params.currentEntity = params.prevPos
      reply = await contexts.tutor(message, params, userFromDB)
    } else {
      params.currentEntity = 'fallback'
      reply = await contexts.opentalk(message, params, userFromDB)
    }
    break

  case 'helpUser_Init':
    flowControlUpdate = { open_question: true, next_pos: 'helpUser_Init', current_flow: 'general' }
    reply = generalReplies('helpUser_Init', senderName, wildcard)
    break

  case 'helpUser1':
    flowControlUpdate = { current_pos: 'helpUser1', open_question: true, next_pos: 'helpUser_Final', current_flow: 'general' }
    reply = generalReplies('helpUser1', senderName, wildcard)
    break

  case 'helpUser_Final':
    flowControlUpdate = { current_pos: 'helpUser_Final', open_question: 'false', next_pos: 'TBD', current_flow: params.prevFlow }
    reply = generalReplies('helpUser_Final', senderName)
    try {
      console.log('User requesting assistance - Sending notification to SLACK')
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://hooks.slack.com/services/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',
        method: 'post',
        data: `{"text":"User ${userFullName} request for *HELP*: _${params.rawUserInput}_"}`,
      })
    } catch (reason) {
      console.log('An error occurred while sending HELP request to API:: ', reason)
      break
    }
    break

  case 'userProfile':
    flowControlUpdate = { current_pos: 'userProfile' }
    wildcard = prepareProfile(userFromDB)
    reply = accountReplies('userProfileTop', senderName, wildcard)
    break

  case 'sendRestartedContent':
    console.log('User restarting the content messages from day 1')
    flowControlUpdate = { open_question: 'false', prev_pos: 'sendRestartedContent', next_pos: 'TBD', current_flow: 'opentalk' }
    reply = generalReplies('sendRestartedContent', senderName)
    break

  // -- Function triggered by HELP in USER PROFILE/ACCOUNT
  case 'customUserRequest':
    flowControlUpdate = { open_question: true, next_pos: 'sendCustomUserRequest', current_flow: 'general' }
    reply = generalReplies('customUserRequest', senderName)
    break

  case 'sendCustomUserRequest':
    flowControlUpdate = { open_question: 'false', next_pos: 'TBD', prev_pos: 'sendCustomUserRequest', current_flow: 'opentalk' }
    reply = generalReplies('sendCustomUserRequest', senderName)
    try {
      console.log('User making a custom request - Sending notification to SLACK')
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://hooks.slack.com/services/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',
        method: 'post',
        data: `{"text":"User ${userFullName} *Custom Request:* _${params.rawUserInput}_"}`,
      })
    } catch (reason) {
      console.log('An error occurred while sending CUSTOM USER request to API:: ', reason)
      break
    }
    break

  case 'DIRECT_TRANSLATE':
    flowControlUpdate = { prev_pos: 'DIRECT_TRANSLATE' }
    reply = translateReplies(params.rawUserInput)
    break

  case 'confirmDeleteAccRequest':
    flowControlUpdate = { open_question: 'false', prev_pos: 'confirmDeleteAccRequest', next_pos: 'userDeleteAccSecondStep', current_flow: 'general' }
    reply = generalReplies('confirmDeleteAccRequest', senderName)
    break

  case 'userDeleteAccSecondStep':
    flowControlUpdate = { open_question: 'false', prev_pos: 'userDeleteAccSecondStep', next_pos: 'accountDeletedMsg', current_flow: 'general' }
    reply = generalReplies('userDeleteAccSecondStep', senderName)
    break

  case 'accountDeletedMsg':
    await API.deleteUser(message.sender.id)
      .catch(err => {
        console.log('Error deleting the user :: ', err)
      })
    flowControlUpdate = { open_question: 'false', prev_pos: 'accountDeletedMsg', next_pos: 'fallback', current_flow: 'opentalk' }
    reply = generalReplies('accountDeletedMsg', senderName, wildcard)
    break

  default:
    console.log('The user was send to the general context with an unrecognized entity')
  }

  if (!reply) {
    console.log('Returning reply as undefined at the general conversation')
    params.currentEntity = 'fallback'
    reply = contexts.opentalk(message, params, userFromDB)
  }

  // -- Update the Flow control AT REDIS
  if (flowControlUpdate) {
    await API.updateFlow(message.sender.id, flowControlUpdate)
      .catch(err => console.log('Error updating flow :: ', err))
  }

  // -- Check the list of entities which will force the user to return to a LOCKED CONTEXT
  if (ifHereGoBack.indexOf(params.currentEntity) > -1) {
    if (params.prevFlow === 'tutor' || params.prevFlow === 'introduction') {
      goToPreviousContext(message, params, userFromDB)
        .catch(err => console.log('Error returning from general context to Tutor Context :: ', err))
    }
  }

  return reply
}

module.exports = getReply

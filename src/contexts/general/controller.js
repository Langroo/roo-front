const getReply = async (message, params, userFromDB) => {
  console.info('###### Inside GENERAL context, CONTROLLER started ######')

  /**
   * Requires and Imports of external modules and libraries
   * */
  const API = require('../../api/index').dbApi
  const axios = require('axios')
  const accountReplies = require('./responses').accountReplies
  const subscriptionReplies = require('./responses').subscriptionReplies
  const generalReplies = require('./responses').generalReplies
  const translateReplies = require('./responses').translateReplies
  const OneForAll = require('../../bot-tools').OneForAll
  const FbAPIClass = require('../../bot-tools').FacebookAPI
  const BotCache = require('../../bot-tools').BotCache

  // -- Instantiations
  const controllerSmash = new OneForAll()
  const FacebookAPI = new FbAPIClass(message.sender.id)

  // -- general usage variables
  const flows = require('../index')

  let flowControlUpdate, reply, userProduct, subscriptionDate, userSubscriptionStatus, currency,
    paymentUrl, delayedRepliesToSend, tempReply, trueReply

  // -- Pre-initialized variables
  let delayedMsgTime = 15
  let wildcard = {}
  const upgradableMemberships = ['2 Week Free Trial', 'Content Only Programme', 'Casual Tutor Programme', 'Standard Tutor Programme']
  const ifHereGoBack = ['FORTUNE_QUOTE', 'TRANSLATE_RETURNER', 'DIRECT_TRANSLATE', 'mustRegisterFirst', 'helpUser1', 'showSubscriptions', 'howToConverseMenu', 'showPricing', 'askRoo']

  // -- Define the user first name and full name
  const senderName = params.senderName
  const userFullName = params.fullName

  /**
   * Disable the following options during the following flow
   * */
  const disablingFlow = 'introduction'
  const optionsToDisable = ['startPaymentFlow', 'helpUser_Init', 'userProfile', 'chooseNewLevel', 'chooseNewAccent']
  if (optionsToDisable.indexOf(params.currentEntity) > -1 && params.prevFlow === disablingFlow) {
    params.currentEntity = 'mustRegisterFirst'
  }

// -- Specific cases that require translation
  if (params.currentEntity === 'userProfile') {
    if (userFromDB.data) {
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
        wildcard = {
          userAccent: userFromDB.data.content.plan.accent,
          userLevel: userFromDB.data.content.plan.level,
          userProduct,
          userSubscriptionStatus,
          subscriptionDate,
        }
        console.log('User account requested')
        console.log('\nUser data is :: ', wildcard)
      } catch (e) {
        console.error('Error setting user profile :: ', e)
        return reply = [{ type: 'text', content: 'Sorry, can\'t show you your profile at this moment 😩👎' }]
      }
    }
  }

  /**
   * Determine if this is an open question
   * */
  if (params.currentEntity === undefined && params.OpQ) {
    params.currentEntity = params.currentPos
  }

  /**
   * Conditionals to decide which replies group to send
   * */

  switch (params.currentEntity) {

  case 'broadcastRestart':
    params.currentEntity = 'rooIntroduction'
    tempReply = await flows.introduction(message, params, userFromDB)
    trueReply = [tempReply.pop()]
    return reply = generalReplies('broadcastRestart', senderName).concat(trueReply)

  case 'broadcastStartLater':
    params.currentEntity = 'rooIntroduction'
    tempReply = await flows.introduction(message, params, userFromDB)
    trueReply = [tempReply.pop()]
    tempReply = generalReplies('broadcastStartLater', senderName)
    tempReply.pop()
    return reply = tempReply.concat(trueReply)

  case 'broadcastShare':
    reply = generalReplies('broadcastShare', senderName)
    break

  case 'broadcastStartLaterActive':
    tempReply = [generalReplies('broadcastStartLater', senderName)[0]]
    reply = tempReply.concat(generalReplies('broadcastStartLater', senderName).pop())
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

  case 'askRoo':
    try {
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://hooks.slack.com/services/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',
        method: 'post',
        data: `{"text":"*User ${userFullName} asks:* ${params.rawUserInput}", "icon_emoji": ":question:", "username": "Ask Roo"}`,
      })
      console.log('User is making a question')
    } catch (reason) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending question to SLACK :: ', reason)
    }
    reply = [generalReplies('askRoo', senderName)[Math.floor(Math.random() * generalReplies('askRoo', senderName).length)]]
    break

  case 'pronounceThis':
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
        reply = [{ type: 'text', content: `I am sorry😫 ${senderName}, my throat is a bit sore right now 😖... Try again ☝ later and I will send you a voice note 📢 with the pronunciation of that.` }]
      }

    } else {
      reply = [{ type: 'text', content: `I am sorry😫 ${senderName}, my throat is a bit sore right now 😖... Try again ☝ later and I will send you a voice note 📢 with the pronunciation of that.` }]
    }
    break

  case 'mustRegisterFirst':
    params.currentEntity = params.currentPos
    tempReply = await flows.introduction(message, params, userFromDB)
    trueReply = [tempReply.pop()]
    return reply = generalReplies('mustRegisterFirst', senderName).concat(trueReply)

  // -- Function triggered by the STOP ALL CONVERSATION in the menu and the DELETE ACCOUNT
  case 'BOT_STOP':
    flowControlUpdate = { prev_pos: 'BOT_STOP', open_question: 'false', next_pos: 'stopBotMessages1', current_flow: 'general' }
    reply = generalReplies('initStopBotMessages', senderName)
    break

  case 'stopBotMessages1':
    try {
      await API.deleteUser(message.sender.id)
    } catch (error) {
      console.log('(!) ERROR (!) :: THE USER WAS NOT UNSUBSCRIBED SUCCESSFULLY')
    }
    flowControlUpdate = { current_pos: 'stopBotMessages1', prev_pos: 'stopBotMessages1', open_question: true, next_pos: 'stopBotMessages2' }
    reply = generalReplies('stopBotMessages1', senderName)
    break

  case 'stopBotMessages2':
    flowControlUpdate = { prev_pos: 'BOT_FROZEN', open_question: true, next_pos: 'BOT_STOP_THANKS' }
    reply = generalReplies('stopBotMessages2')
    break

  case 'BOT_STOP_THANKS':
    flowControlUpdate = { prev_pos: 'BOT_STOP_THANKS', current_flow: 'autoresponder' }
    reply = generalReplies('thanksForFeedback')
    break

  case 'FORTUNE_QUOTE':
    flowControlUpdate = { prev_pos: 'FORTUNE_QUOTE' }
    reply = generalReplies('fortuneQuote')
    break

  case 'startPaymentFlow':
    try {
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: process.env.PAYMENT_NOTIFICATIONS_SLACK_URL,
        method: 'post',
        data: `{"text":"User ${userFullName} has initiated the *Payment/Upgrade Plan conversational flow*"}`,
      })
      console.log('User initiated payment flow')
    } catch (reason) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending the notification to SLACK :: ', reason)
    }
    flowControlUpdate = { current_pos: 'startPaymentFlow', open_question: 'false', next_pos: 'showSubscriptions' }
    reply = subscriptionReplies('startPaymentFlow', senderName, {})
    break

  case 'showSubscriptions':
    currency = params.rawUserInput.substr(0, 3)
    paymentUrl = {
      casualURL: `${process.env.API_BASE_URL}/payment/casual/${message.sender.id}/${currency}`,
      standardURL: `${process.env.API_BASE_URL}/payment/standard/${message.sender.id}/${currency}`,
      eliteURL: `${process.env.API_BASE_URL}/payment/elite/${message.sender.id}/${currency}`,
      currency,
    }
    flowControlUpdate = { open_question: 'false', next_pos: 'TBD', prev_pos: 'showSubscriptions', current_flow: 'general' }
    reply = subscriptionReplies('showSubscriptions', senderName, paymentUrl)
    break

  case 'restartUserContent':
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
        reply = [{ type: 'text', content: `Content restarted for ${targetUser} ʕᵔᴥᵔʔ` }]
        await API.sendLesson(userSenderId)
      } else {
        reply = [{ type: 'text', content: 'Could not restart content for this user, check the logs {•̃_•̃ } ' }]
      }
    }
    break

  case 'continueCurrentFlow':
    if (params.prevFlow === 'introduction') {
      params.currentEntity = params.prevPos
      reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'tutor') {
      params.currentEntity = params.prevPos
      reply = await flows.tutor(message, params, userFromDB)
    } else {
      params.currentEntity = 'fallback'
      reply = await flows.OpenTalk(message, params, userFromDB)
    }
    break

  case 'helpUser_Init':
    flowControlUpdate = { open_question: true, next_pos: 'helpUser_Init', current_flow: 'general' }
    reply = generalReplies('helpUser_Init', senderName, wildcard)
    break

  case 'helpUser1':
    flowControlUpdate = { current_pos: 'helpUser1', open_question: true, next_pos: 'helpUser_Final', current_flow: 'general' }
    delayedMsgTime = 1800
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
    await API.updateFlow(message.sender.id, { current_pos: 'userProfile', current_flow: 'autoresponder', open_question: 'false' })
    if (upgradableMemberships.indexOf(userProduct) > -1 || userSubscriptionStatus === 'TRIAL_FINISHED') {
      reply = accountReplies('userProfileUpgradeable', senderName, wildcard)
    }
    reply = accountReplies('userProfileTop', senderName, wildcard)
    break

  case 'RESET':
    let standingFlow
    try {
      standingFlow = (await API.retrieveFlow(message.sender.id)).data.current_flow
    } catch (error) { console.log('Error retrieving user flow to determine action to RESET trigger') }
    if (!userFromDB.data || standingFlow === 'introduction' || params.rawUserInput === 'restart full conversation') {

      flowControlUpdate = { current_flow: 'introduction', current_pos: 'getStarted' }
      params.currentEntity = 'getStarted'
      reply = await flows.introduction(message, params, userFromDB)

    } else if (standingFlow === 'tutor') {

      flowControlUpdate = { current_flow: 'tutor' }
      params.currentEntity = 'tb0'
      reply = await flows.tutor(message, params, userFromDB)

    } else {

      flowControlUpdate = { current_pos: 'RESET', open_question: 'false', next_pos: 'TBD', current_flow: 'autoresponder' }
      reply = generalReplies('restartOptions', senderName)
    }
    break

  case 'sendRestartedContent':
    console.log('User restarting the content messages from day 1')
    flowControlUpdate = { open_question: 'false', prev_pos: 'sendRestartedContent', next_pos: 'TBD', current_flow: 'autoresponder' }
    reply = generalReplies('sendRestartedContent', senderName)
    break

  // -- Function triggered by HELP in USER PROFILE/ACCOUNT
  case 'customUserRequest':
    flowControlUpdate = { open_question: true, next_pos: 'sendCustomUserRequest', current_flow: 'general' }
    reply = generalReplies('customUserRequest', senderName)
    break

  case 'sendCustomUserRequest':
    flowControlUpdate = { open_question: 'false', next_pos: 'TBD', prev_pos: 'sendCustomUserRequest', current_flow: 'autoresponder' }
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
    try {
      await API.deleteUser(message.sender.id)
    } catch (error) {
      console.log('Error deleting the user')
      break
    }
    flowControlUpdate = { open_question: 'false', prev_pos: 'accountDeletedMsg', next_pos: undefined, current_flow: 'autoresponder' }
    reply = generalReplies('accountDeletedMsg', senderName, wildcard)
    break

  default:
    console.log('No case matched')
  }

  if (!reply) {
    console.log('Returning reply as undefined at the general conversation')
    params.currentEntity = 'fallback'
    reply = flows.OpenTalk(message, params, userFromDB)
  }
  if (flowControlUpdate) {
    try {
      await API.updateFlow(message.sender.id, flowControlUpdate)
    } catch (e) {
      (console.error('Error updating flow ::', e))
    }
  }

  /**
   * A delayed reply in case the user is inside a conversational flow
   * */

  if (ifHereGoBack.indexOf(params.currentEntity) > -1) {
    if (params.prevFlow === 'tutor') {
      params.currentEntity = params.currentPos
      tempReply = await flows.tutor(message, params, userFromDB)
      trueReply = [tempReply.pop()]
      delayedRepliesToSend = generalReplies('returningMessages', senderName)[Math.floor(Math.random() * generalReplies('returningMessages', senderName).length)]
      delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.currentPos, prev_pos: params.prevPos, repeated_this_pos: '1' }, message.sender.id, userFromDB)

    } else if (params.prevFlow === 'introduction') {
      params.currentEntity = params.currentPos
      params.repeatedThisPos = '1'
      params.currentFlow = 'introduction'
      tempReply = await flows.introduction(message, params, userFromDB)
      trueReply = [tempReply.pop()]
      delayedRepliesToSend = generalReplies('returningMessages', senderName)[Math.floor(Math.random() * generalReplies('returningMessages', senderName).length)]
      delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.currentPos, prev_pos: params.prevPos, repeated_this_pos: '1' }, message.sender.id, userFromDB)

    } else if (params.prevFlow === 'content') {
      params.currentEntity = 'afterGeneralFunctionReply'
      params.currentPos = 'afterGeneralFunctionReply'
      params.repeatedThisPos = '1'
      params.currentFlow = 'content'
      trueReply = await flows.content(message, params, userFromDB)
      controllerSmash.CronReminder(params.currentPos, trueReply, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.currentPos, prev_pos: params.prevPos, repeated_this_pos: '1' }, message.sender.id, userFromDB)

    } else if (params.prevFlow === 'survey') {
      params.currentEntity = params.currentPos
      params.repeatedThisPos = '1'
      params.currentFlow = 'survey'
      trueReply = await flows.survey(message, params, userFromDB)
      delayedRepliesToSend = trueReply
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.currentPos, prev_pos: params.prevPos, repeated_this_pos: '1' }, message.sender.id, userFromDB)

    }
  }
  return reply
}

module.exports = getReply

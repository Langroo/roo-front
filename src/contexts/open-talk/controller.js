// -- This context contains the logic for the autoresponders, fallback replies, Frequently Asked Questions and Daily story
const getReply = async (message, params, userFromDB) => {

  /**
   * Requiring and importing
   * */
  const API = require('../../api/index').dbApi
  const genericReplies = require('./responses').genericReplies
  const failsafeReplies = require('./responses').failsafeReplies
  const OneForAll = require('../../bot-tools').OneForAll
  const controllerSmash = new OneForAll()

  // -- Variable Declaration
  let reply
  let trueReply
  let delayedRepliesToSend
  let flowControlUpdate
  let metadataUpdate
  let delayedMsgTime = 6
  let isQuestion
  let dice
  let autoresPos
  const senderName = params.senderName
  const flows = require('../index')
  const contextsToReturn = ['introduction', 'tutor', 'survey', 'content']
  const regexQuestion = /.*\?+$/i

  /* ***********************************************************************************************
   * **************** Patch changing users with autoresponder position to fallback position *********
   * ************************************************************************************************/

  if ((params.currentFlow === 'autoresponder' || params.prevPos === 'autoresponder' || params.currentPos === 'autoresponder') && !params.currentEntity) {
    flowControlUpdate = { current_flow: 'OpenTalk', current_pos: 'fallback', prev_pos: 'fallback', prev_flow: 'OpenTalk' }
    params.currentEntity = 'fallback'
  }

  switch (params.currentEntity) {

  case 'fallback':
    isQuestion = regexQuestion.test(params.rawUserInput)

      // -- Controller to reply if user input is question or if it is not a question
    if (params.autoresponderReply) {
      dice = params.autoresponderReply.split(',')
    } else {
      dice = ['0']
    }

    if (isQuestion) {
      if (dice.length < 4) {
        autoresPos = Math.floor(Math.random() * genericReplies('repliesForQuestions', senderName).length)
        while (dice.indexOf(autoresPos.toString()) > -1) {
          autoresPos = Math.floor(Math.random() * genericReplies('repliesForQuestions', senderName).length)
        }
        dice.push(autoresPos.toString())
        reply = genericReplies('repliesForQuestions', senderName)[autoresPos]
        flowControlUpdate = { autoresponder_reply: dice.toString() }

      } else if (dice.length === 4) {
        autoresPos = Math.floor(Math.random() * genericReplies('gifsForQuestions', senderName).length)
        reply = genericReplies('gifsForQuestions', senderName)[autoresPos]
        dice.push('Gif')
        flowControlUpdate = { autoresponder_reply: dice.toString() }

      } else {
        reply = genericReplies('writeNextPhrase', senderName)
        flowControlUpdate = { autoresponder_reply: '0' }
      }
    } else if (dice.length < 4) {
      autoresPos = Math.floor(Math.random() * genericReplies('repliesForNoQuestions', senderName).length)
      while (dice.indexOf(autoresPos.toString()) > -1) {
        autoresPos = Math.floor(Math.random() * genericReplies('repliesForNoQuestions', senderName).length)
      }
      dice.push(autoresPos.toString())
      reply = genericReplies('repliesForNoQuestions', senderName)[autoresPos]
      flowControlUpdate = { autoresponder_reply: dice.toString() }

    } else if (dice.length === 4) {
      autoresPos = Math.floor(Math.random() * genericReplies('gifsForNoQuestions', senderName).length)
      reply = genericReplies('gifsForNoQuestions', senderName)[autoresPos]
      dice.push('Gif')
      flowControlUpdate = { autoresponder_reply: dice.toString() }
    } else {
      reply = genericReplies('writeNextPhrase', senderName)
      flowControlUpdate = { autoresponder_reply: '0' }
    }
    break

  case 'tutorTryoutReply':
    reply = genericReplies('tutorTryoutReply', senderName)
    break

  case 'finishedReply':
    if (contextsToReturn.indexOf(params.prevFlow) !== -1) {
      reply = [genericReplies('finishedReply', senderName)[0]]
      delayedMsgTime = 2
    } else {
      reply = [genericReplies('finishedReply', senderName)[1]]
    }
    break

  case 'dailyStory':
    if (params.prevFlow === 'introduction') {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = genericReplies('noVideoBeforeIntro', senderName).concat(await flows.introduction(message, params, userFromDB))
    } else if (contextsToReturn.indexOf(params.prevFlow) !== -1) {
      reply = genericReplies('dailyStory', senderName)
      delayedMsgTime = 90
    } else {
      reply = genericReplies('dailyStory', senderName)
      reply.pop()
      flowControlUpdate = { current_pos: 'dailyStory', current_flow: 'OpenTalk', prev_flow: 'OpenTalk' }
    }
    break

  case 'myCreatorReply':
    reply = genericReplies('myCreatorReply', senderName)
    break

  case 'goToHellReply':
    reply = genericReplies('goToHellReply', senderName)[Math.floor(Math.random() * genericReplies('goToHellReply', senderName).length)]
    break

  case 'footballReply':
    reply = genericReplies('footballReply', senderName)[Math.floor(Math.random() * genericReplies('footballReply', senderName).length)]
    break

  case 'existenceReply':
    reply = genericReplies('existenceReply', senderName)[Math.floor(Math.random() * genericReplies('existenceReply', senderName).length)]
    break

  case 'identityReply':
    if (params.prevFlow === 'introduction' && params.prevPos === 'askWhoIsRoo') {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('identityReply', senderName)
    break

  case 'laughterReply':
    reply = genericReplies('laughterReply', senderName)[Math.floor(Math.random() * genericReplies('laughterReply', senderName).length)]
    break

  case 'agreementReply':
    if (params.prevFlow === 'introduction' && params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'introduction' && !params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = undefined
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('agreementReply', senderName)[Math.floor(Math.random() * genericReplies('existenceReply', senderName).length)]
    break

  case 'ageReply':
    reply = genericReplies('ageReply', senderName)
    break

  case 'locationReply':
    reply = genericReplies('locationReply', senderName)
    break

  case 'functionReply':
    reply = genericReplies('functionReply', senderName)
    break

  case 'languageReply':
    reply = genericReplies('languageReply', senderName)
    break

  case 'whatsupReply':
    if (params.prevFlow === 'introduction' && params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'introduction' && !params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = undefined
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('whatsupReply', senderName)[Math.floor(Math.random() * genericReplies('whatsupReply', senderName).length)]
    break

  case 'badWordsReply':
    reply = genericReplies('badWordsReply', senderName)[Math.floor(Math.random() * genericReplies('badWordsReply', senderName).length)]
    break

  case 'missunderstandingReply':
    if (params.prevFlow === 'content' && params.OpQ) {
      params.currentFlow = 'content'
      params.currentEntity = 'sendContent'
      return reply = await flows.content(message, params, userFromDB)
    } else if (params.prevFlow === 'content' && !params.OpQ) {
      params.currentFlow = 'content'
      params.currentEntity = 'sendContent'
      return reply = await flows.content(message, params, userFromDB)
    }
    reply = genericReplies('missunderstandingReply', senderName)
    break

  case 'areYouThereReply':
    reply = genericReplies('areYouThereReply', senderName)[Math.floor(Math.random() * genericReplies('areYouThereReply', senderName).length)]
    break

  case 'genderReply':
    reply = genericReplies('genderReply', senderName)
    break

  case 'teachMeReply':
    if (params.prevFlow === 'introduction') {
      params.currentFlow = 'introduction'
      params.currentEntity = params.currentPos
      return reply = [genericReplies('teachMeReply', senderName)[1]].concat((await flows.introduction(message, params, userFromDB)).pop())
    }
    reply = [genericReplies('teachMeReply', senderName)[0]]
    break

  case 'menuReply':
    reply = genericReplies('menuReply', senderName)
    break

  case 'talkToOthersReply':
    reply = genericReplies('talkToOthersReply', senderName)[Math.floor(Math.random() * genericReplies('talkToOthersReply', senderName).length)]
    break

  case 'salutationReply':
    if (params.prevFlow === 'introduction' && params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'introduction' && !params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = undefined
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('salutationReply', senderName)[Math.floor(Math.random() * genericReplies('salutationReply', senderName).length)]
    break

  case 'believeInGodReply':
    reply = genericReplies('believeInGodReply', senderName)[Math.floor(Math.random() * genericReplies('believeInGodReply', senderName).length)]
    break

  case 'youAreUglyReply':
    reply = genericReplies('youAreUglyReply', senderName)[Math.floor(Math.random() * genericReplies('youAreUglyReply', senderName).length)]
    break

  case 'likeAboutMeReply':
    reply = genericReplies('likeAboutMeReply', senderName)[Math.floor(Math.random() * genericReplies('likeAboutMeReply', senderName).length)]
    break

  case 'areYouInLoveReply':
    reply = genericReplies('areYouInLoveReply', senderName)[Math.floor(Math.random() * genericReplies('areYouInLoveReply', senderName).length)]
    break

  case 'goodbyeReply':
    reply = genericReplies('goodbyeReply', senderName)[Math.floor(Math.random() * genericReplies('goodbyeReply', senderName).length)]
    break

  case 'whatAreYourHobbiesReply':
    reply = genericReplies('whatAreYourHobbiesReply', senderName)[Math.floor(Math.random() * genericReplies('whatAreYourHobbiesReply', senderName).length)]
    break

  case 'goodnightReply':
    reply = genericReplies('goodnightReply', senderName)[Math.floor(Math.random() * genericReplies('goodnightReply', senderName).length)]
    break

  case 'whatAboutYouReply':
    if (params.prevFlow === 'introduction' && params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'introduction' && !params.OpQ) {
      params.currentFlow = 'introduction'
      params.currentEntity = undefined
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('whatAboutYouReply', senderName)[Math.floor(Math.random() * genericReplies('whatAboutYouReply', senderName).length)]
    break

  case 'starcraftReply':
    reply = genericReplies('starcraftReply', senderName)[Math.floor(Math.random() * genericReplies('starcraftReply', senderName).length)]
    break

  case 'whatTimeIsItReply':
    reply = genericReplies('whatTimeIsItReply', senderName)[Math.floor(Math.random() * genericReplies('whatTimeIsItReply', senderName).length)]
    break

  case 'doYouLikeKeywordReply':
    reply = genericReplies('doYouLikeKeywordReply', senderName)[Math.floor(Math.random() * genericReplies('doYouLikeKeywordReply', senderName).length)]
    break

  case 'doYouLoveMeReply':
    reply = genericReplies('doYouLoveMeReply', senderName)[Math.floor(Math.random() * genericReplies('doYouLoveMeReply', senderName).length)]
    break

  case 'tellSecretReply':
    reply = genericReplies('tellSecretReply', senderName)[Math.floor(Math.random() * genericReplies('tellSecretReply', senderName).length)]
    break

  case 'doYouRememberMeReply':
    reply = genericReplies('doYouRememberMeReply', senderName)[Math.floor(Math.random() * genericReplies('doYouRememberMeReply', senderName).length)]
    break

  case 'lookingForwardToReply':
    reply = genericReplies('lookingForwardToReply', senderName)[Math.floor(Math.random() * genericReplies('lookingForwardToReply', senderName).length)]
    break

  case 'feelingBoredReply':
    reply = genericReplies('feelingBoredReply', senderName)[Math.floor(Math.random() * genericReplies('feelingBoredReply', senderName).length)]
    break

  case 'whenYouOnlineReply':
    reply = genericReplies('whenYouOnlineReply', senderName)[Math.floor(Math.random() * genericReplies('whenYouOnlineReply', senderName).length)]
    break

  case 'thanksReply':
    reply = genericReplies('thanksReply', senderName)[Math.floor(Math.random() * genericReplies('thanksReply', senderName).length)]
    break

  case 'hateReply':
    reply = genericReplies('hateReply', senderName)[Math.floor(Math.random() * genericReplies('hateReply', senderName).length)]
    break

  case 'pricingReply':
    reply = genericReplies('pricingReply', senderName)
    break

  case 'loveReply':
    reply = genericReplies('loveReply', senderName)[Math.floor(Math.random() * genericReplies('loveReply', senderName).length)]
    break

  case 'esExistenceReply':
    reply = genericReplies('esExistenceReply', senderName)
    break

  case 'esIdentityReply':
    reply = genericReplies('esIdentityReply', senderName)
    break

  case 'esLanguageReply':
    reply = genericReplies('esLanguageReply', senderName)
    break

  case 'ptExistenceReply':
    reply = genericReplies('ptExistenceReply', senderName)
    break

  case 'ptIdentity':
    reply = genericReplies('ptIdentity', senderName)
    break

  case 'ptAgeReply':
    reply = genericReplies('ptAgeReply', senderName)
    break

  case 'ptLocationReply':
    reply = genericReplies('ptLocationReply', senderName)
    break

  case 'ptFunctionReply':
    reply = genericReplies('ptFunctionReply', senderName)
    break

  case 'ptLanguageReply':
    reply = genericReplies('ptLanguageReply', senderName)
    break

  case 'ptWhatsupReply':
    reply = genericReplies('ptWhatsupReply', senderName)[Math.floor(Math.random() * genericReplies('ptWhatsupReply', senderName).length)]
    break

  case 'ptBadWordsReply':
    reply = genericReplies('ptBadWordsReply', senderName)[Math.floor(Math.random() * genericReplies('ptBadWordsReply', senderName).length)]
    break

  case 'ptHelpReply':
    reply = genericReplies('ptHelpReply', senderName)
    break

  case 'ptMyCreatorReply':
    reply = genericReplies('ptMyCreatorReply', senderName)
    break

  case 'ptAreYouThereReply':
    reply = genericReplies('ptAreYouThereReply', senderName)[Math.floor(Math.random() * genericReplies('ptAreYouThereReply', senderName).length)]
    break

  case 'ptGenderReply':
    reply = genericReplies('ptGenderReply', senderName)
    break

  case 'ptTeachMeReply':
    reply = genericReplies('ptTeachMeReply', senderName)
    break

  case 'ptMenuReply':
    reply = genericReplies('ptMenuReply', senderName)
    break

  case 'ptThanksReply':
    reply = genericReplies('ptThanksReply', senderName)[Math.floor(Math.random() * genericReplies('ptThanksReply', senderName).length)]
    break

  case 'ptHateReply':
    reply = genericReplies('ptHateReply', senderName)[Math.floor(Math.random() * genericReplies('ptHateReply', senderName).length)]
    break

  case 'ptPricingReply':
    reply = genericReplies('ptPricingReply', senderName)
    break

  case 'ptLoveReply':
    reply = genericReplies('ptLoveReply', senderName)[Math.floor(Math.random() * genericReplies('ptLoveReply', senderName).length)]
    break

  case 'ptGreetReply':
    if (params.prevFlow === 'introduction' && params.OpQ) {
      params.currentEntity = params.nextPos
      return reply = await flows.introduction(message, params, userFromDB)
    } else if (params.prevFlow === 'introduction' && !params.OpQ) {
      params.currentEntity = undefined
      return reply = await flows.introduction(message, params, userFromDB)
    }
    reply = genericReplies('ptGreetReply', senderName)[Math.floor(Math.random() * genericReplies('ptGreetReply', senderName).length)]
    break

  case 'ptByeReply':
    reply = genericReplies('ptByeReply', senderName)[Math.floor(Math.random() * genericReplies('ptByeReply', senderName).length)]
    break

  case 'wontDoSurvey':
    reply = genericReplies('wontDoSurvey', senderName)
    flowControlUpdate = { survey_done: 'will not do survey', current_flow: 'openconv', prev_flow: 'openconv' }
    break

  case 'willDoSurvey':
    if (params.surveyDone === 'survey completed' || params.surveyDone === 'yes') {
      reply = genericReplies('alreadyDidSurvey', senderName)[Math.floor(Math.random() * genericReplies('alreadyDidSurvey', senderName).length)]
    } else {
      reply = genericReplies('surveyReplies', senderName).slice(2, 5)
      flowControlUpdate = { survey_done: 'partially' }
    }
    break
    /* ******************************************************************************************************
     * ********************************** Unrecognized entity Section ***************************************
     * ******************************************************************************************************/
  default:
    params.currentEntity = 'fallback'
    return await flows.OpenTalk(message, params, userFromDB)
  }

    /**
     * Escape trigger to finish conversational flows
     * */

  if (contextsToReturn.indexOf(params.prevFlow) > -1) {
    if (params.prevFlow === 'tutor') {

      params.currentFlow = 'tutor'
      params.currentEntity = params.currentPos
      const tempReply = await flows.tutor(message, params, userFromDB)
      trueReply = [tempReply.pop()]
      delayedRepliesToSend = failsafeReplies('lostInConversation', senderName)[Math.floor(Math.random() * failsafeReplies('lostInConversation', senderName).length)]
      delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.prevPos, repeated_this_pos: params.repeatedThisPos }, message.senderId, userFromDB)

    } else if (params.prevFlow === 'introduction') {

      params.currentFlow = 'introduction'
      params.repeatedThisPos = '1'
      params.currentEntity = params.currentPos
      const tempReply = await flows.introduction(message, params, userFromDB)
      trueReply = [tempReply.pop()]
      delayedRepliesToSend = failsafeReplies('lostInConversation', senderName)[Math.floor(Math.random() * failsafeReplies('lostInConversation', senderName).length)]
      delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.prevPos, repeated_this_pos: params.repeatedThisPos }, message.senderId, userFromDB)

    } else if (params.prevFlow === 'survey') {

      params.currentFlow = 'survey'
      params.repeatedThisPos = '1'
      params.currentEntity = params.currentPos
      const tempReply = await flows.survey(message, params, userFromDB)
      trueReply = [tempReply.pop()]
      delayedRepliesToSend = failsafeReplies('lostInConversation', senderName)[Math.floor(Math.random() * failsafeReplies('lostInConversation', senderName).length)]
      delayedRepliesToSend = delayedRepliesToSend.concat(trueReply)
      controllerSmash.CronReminder(params.currentPos, delayedRepliesToSend, delayedMsgTime, { current_flow: params.prevFlow, current_pos: params.prevPos, repeated_this_pos: params.repeatedThisPos }, message.senderId, userFromDB)

    } else if (params.prevFlow === 'content') {

      const repeatedPosNumber = parseInt(params.repeatedThisPos, 10) + 1
      params.currentFlow = 'content'
      params.repeatedThisPos = repeatedPosNumber.toString()
      params.currentEntity = 'sendContent'
      params.currentPos = 'sendContent'
      controllerSmash.CronFunction(delayedMsgTime, API.sendLesson, null, message.senderId)
    }
  }

  // -- Calls to store data at MongoDB/Redis
  if (flowControlUpdate) {
    await API.updateFlow(message.senderId, flowControlUpdate)
  } else if (metadataUpdate) {
    await API.updateUserProfile(message.senderId, metadataUpdate, 'metadata')
  }

  return reply
}

module.exports = getReply

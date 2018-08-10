const getReply = async (message, params, userFromDB) => {

  /**
   * Requires and Imports of modules and libraries
   * */
  const API = require('../../core/index').dbApi
  const standardReplies = require('./responses').standardReplies
  const flows = require('../index')
  const futureMsg = { doSend: false, timeInSeconds: 10800, placeInFlow: {} }
  const senderName = params.senderName

  let reply
  let flowControlUpdate
  let info

  // -- IF THE USER IS IN THE INTRODUCTION WE SEND HIM BACK
  if (params.prevFlow === 'introduction') {
    params.currentEntity = params.currentPos
    const tempReply = await flows.introduction(message, params, userFromDB)
    const trueReply = [tempReply.pop()]
    return reply = [standardReplies('mustRegisterFirst', senderName)[Math.floor(Math.random() * standardReplies('mustRegisterFirst', senderName).length)]].concat(trueReply)
  }

  // -- IF THE USER IS UNREGISTERED THEN WE SEND HIM BACK TO FINISH THE INTRO
  if (params.status === 'UNREGISTERED') {
    params.currentEntity = 'rooIntroduction'
    const tempReply = await flows.introduction(message, params, userFromDB)
    const trueReply = [tempReply.pop()]
    const preReply = [{ type: 'text', content: `Brilliant ${senderName}, get ready for takeoff! 🚀But, just before I ask some questions first…. 😉` }]
    return reply = preReply.concat(trueReply)
  }

  /* ****************************************************************************
   * ************************ Handle undefined entity ***************************
   * *****************************************************************************/

  if (!params.currentEntity && params.OpQ === true) {
    params.currentEntity = params.nextPos
  } else if (!params.currentEntity) {
    params.currentEntity = params.prevPos
  }

  /* SAFETY MEASURE TO PREVENT ERRORS WITH PEOPLE THAT RECEIVED THE BROADCAST MESSAGE WITH THE OLD ENTITY OF SendNextContentMessage*/
  if (params.currentEntity === 'sendNextContentMsg') { params.currentEntity = 'sendContent' }
  /* ^ Erase this piece of code after August 15, 2018 */

  switch (params.currentEntity) {

  case 'afterGeneralFunctionReply':
    flowControlUpdate = { current_pos: 'afterGeneralFunctionReply', prev_pos: 'sendContent', next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk' }
    reply = standardReplies('afterGeneralFunctionReply', senderName)
    break

  case 'sendContent':
    futureMsg.doSend = true
    flowControlUpdate = { current_pos: 'sendContent', prev_pos: 'sendContent', open_question: true, next_pos: 'sendContent', current_flow: 'content', prev_flow: 'opentalk' }
    info = await API.sendLesson(message.sender.id)
    if (info.statusCode >= 200 && info.statusCode < 222) {
      console.info('[✔️] API informed: Content sent correctly.')
      reply = []
    } else if (info.statusCode === 222) {
      console.error('[✔️] API informed: Lessons for %s are over for today', senderName)
      flowControlUpdate = { current_pos: 'fallback', prev_pos: 'fallback', next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk' }
      reply = standardReplies('FinalContentMsg', senderName)
    } else if (info.statusCode >= 400) {
      console.error('[X] ERROR SENDING CONTENT, this happened ::', info.data)
    }
    break

  case 'FinalContentMsg':
    flowControlUpdate = { current_pos: 'FinalContentMsg', prev_pos: 'sendContent', next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk' }
    reply = standardReplies('FinalContentMsg', senderName)
    break

  case 'retakeLesson':
    let incRepCount = parseInt(params.repeatedThisPos, 10) + 1
    incRepCount = incRepCount.toString()
    if (parseInt(params.repeatedThisPos, 10) < 2) {
      flowControlUpdate = { current_pos: 'retakeLesson', open_question: 'false', prev_pos: 'retakeLesson', next_pos: 'TBD', prev_flow: 'content', repeated_this_pos: incRepCount }
      reply = standardReplies('retakeLesson', senderName)
    } else {
      flowControlUpdate = { current_pos: 'fallback', open_question: true, prev_pos: 'fallback', next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', repeated_this_pos: '0' }
      params.prevFlow = 'opentalk'
      params.currentEntity = 'fallback'
      reply = await flows.opentalk(message, params, userFromDB)
    }
    break
  default:
    console.log('[X] No case matched inside Content context')
  }

  if (!reply) {
    flowControlUpdate = { current_pos: 'fallback', open_question: true, prev_pos: 'fallback', next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', repeated_this_pos: '0' }
    reply = standardReplies('contentFailMsg', senderName)
  }

  await API.updateFlow(message.sender.id, flowControlUpdate)
  return reply
}

module.exports = getReply

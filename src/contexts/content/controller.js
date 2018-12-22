const getReply = async (message, params, userFromDB) => {
  /**
   * Requires and Imports of modules and libraries
   * */
  const API = require('../../core/index').dbApi;
  const standardReplies = require('./responses').standardReplies;
  const flows = require('../index');
  const futureMsg = { doSend: false, timeInSeconds: 10800, placeInFlow: {} };
  const senderName = params.senderName;
  const OneForAll = require('../../bot-tools/universal').OneForAll;
  const contentSmash = new OneForAll();

  let reply;
  let flowControlUpdate;
  let info;

  // -- IF THE USER IS IN THE INTRODUCTION WE SEND HIM BACK
  if (params.prevFlow === 'introduction' && !params.awaitingAnswer) {
    params.currentEntity = params.currentPos;
    const tempReply = await flows.introduction(message, params, userFromDB);
    const trueReply = [tempReply.pop()];
    return reply = [standardReplies('mustRegisterFirst', senderName)[Math.floor(Math.random() * standardReplies('mustRegisterFirst', senderName).length)]].concat(trueReply);
  }

  // -- IF THE USER IS UNREGISTERED THEN WE SEND HIM BACK TO FINISH THE INTRO
  if (params.status === 'UNREGISTERED' && !params.awaitingAnswer) {
    params.currentEntity = 'rooIntroduction';
    const tempReply = await flows.introduction(message, params, userFromDB);
    const trueReply = [tempReply.pop()];
    const preReply = [{ type: 'text', content: `Brilliant ${senderName}, get ready for takeoff! 🚀But, just before I ask some questions first…. 😉` }];
    return reply = preReply.concat(trueReply);
  }

  /* ****************************************************************************
   * ************************ Handle undefined entity ***************************
   * **************************************************************************** */

  if (!params.currentEntity && params.OpQ === true) {
    params.currentEntity = params.nextPos;
  } else if (!params.currentEntity) {
    params.currentEntity = params.prevPos;
  }

  /* SAFETY MEASURE TO PREVENT ERRORS WITH PEOPLE THAT RECEIVED THE BROADCAST MESSAGE WITH THE OLD ENTITY OF SendNextContentMessage */
  if (params.currentEntity === 'quizReceivedReply') { params.currentEntity = 'quizReceivedReply'; }
  /* ^ Erase this piece of code after August 15, 2018 */

  switch (params.currentEntity) {
    case 'quizReceivedReply':
      const userAnswer = `{"text":"User ${params.senderName} answered the quiz: *${params.rawUserInput}*"}`;
      flowControlUpdate = { current_pos: params.prevPos, current_flow: params.prevFlow, awaiting_answer: '0' };
      reply = standardReplies('quizReceivedReply', senderName);
      contentSmash.sendNotificationToSlack(process.env.QUIZ_ANSWERS_SLACK, userAnswer);
      break;

    case 'afterGeneralFunctionReply':
      flowControlUpdate = {
        current_pos: 'afterGeneralFunctionReply', prev_pos: 'quizReceivedReply', next_pos: 'fallback', current_flow: 'opentalk', prev_flow: 'opentalk',
      };
      reply = standardReplies('afterGeneralFunctionReply', senderName);
      break;

    default:
      console.log('[X] No case matched inside Content context');
  }

  if (!reply) {
    flowControlUpdate = {
      current_pos: 'fallback', open_question: true, prev_pos: 'fallback', next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', repeated_this_pos: '0',
    };
    reply = standardReplies('contentFailMsg', senderName);
  }

  await API.updateFlow(message.sender.id, flowControlUpdate);
  return reply;
};

module.exports = getReply;

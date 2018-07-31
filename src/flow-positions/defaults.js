/**
 * In this file we define the objects with the properties that serve
 * to control the position of the user in a conversation with the bot
 * These objects are send to the API to update the Key:Value pairs of Redis
 * related to the user
 * */
const flowPositions = positionName => {
  let positionObject

  switch (positionName) {

  // -- Used the first time a user speaks to the bot
  case 'newUser':
    positionObject = {
      current_pos: 'getStarted',
      prev_pos: 'getStarted',
      next_pos: 'howAreYouReply',
      open_question: true,
      current_flow: 'introduction',
      last_interaction: Date(),
      ready_to_reply: false,
      prev_flow: 'introduction',
      translate_dialog: 'false',
      repeated_this_pos: '0',
      autoresponder_reply: '0',
      autoresponder_type: 'text',
      survey_done: 'no',
      message_delay: 'on',
      tutor_flow_status: 'unrequested',
    }
    break

  // -- Used for the command "roo masters 101"
  case 'adminFlowReset':
    positionObject = {
      current_pos: 'fallback',
      current_flow: 'OpenTalk',
      prev_flow: 'OpenTalk',
      open_question: 'false',
      awaiting_answer: '0',
      ready_to_reply: true,
      survey_done: 'no',
      autoresponder_reply: '0',
      autoresponder_type: 'text',
      message_delay: 'on',
      tutor_flow_status: 'unrequested',
    }
    break

  // -- If the function is invoked without a valid parameter, we return an empty object
  default:
    positionObject = {}
  }

  return positionObject
}

module.exports = flowPositions

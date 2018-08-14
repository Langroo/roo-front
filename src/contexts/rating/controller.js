const getReply = async (message, params, userFromDB) => {

  // -- Import the responses
  const standardReplies = require('./responses').standardReplies

  // -- Import the API to send the messages to the API
  const API = require('../../core').dbApi

  // -- Declare the reply variable
  let reply

  // -- Declare the variable to set the user flow
  let flowUpdate

  switch (params.currentEntity) {

  case 'pressButtonForRating':
    reply = standardReplies('pressButtonForRating', params.senderName)
    break

  case 'sendRatingToAPI':

    reply = []
    const rating = {
      rating_response_1: '1',
      rating_response_2: '2',
      rating_response_3: '3',
      rating_response_4: '4',
      rating_response_5: '5',
      rating_response_6: '6',
      rating_response_7: '7',
      rating_response_8: '8',
      rating_response_9: '9',
      rating_response_10: '10',
    }
    await API.setRatingCache(message.userHash, rating[params.rawUserInput])
      .catch(err => {
        console.error('ERROR saving the rating in redis :: ', err)
        return reply = [{ type: '', content: `Oh! ${params.senderName}, there was an issue saving your rating. I will remind you next sunday to do it :)` }]
      })
    await API.sendRating(message.sender.id)
      .then(() => {
        console.log('Rating stored successfully')
        flowUpdate = { current_pos: 'fallback', open_question: true, prev_pos: 'fallback', next_pos: 'fallback', prev_flow: 'opentalk', current_flow: 'opentalk', repeated_this_pos: '0' }
        reply = []
      })
      .catch(err => {
        console.error('ERROR saving the rating in Mongo or in the API :: ', err)
      })
    break

  default:
    console.error('Error here on rating')
    reply = [{ type: 'text', content: 'Your rating has been sent, thanks for helping make Roo a better Teacher!' }]
  }

  // -- update the user's flow
  if (flowUpdate) {
    await API.updateFlow(message.sender.id, flowUpdate)
  }

  return reply
}

module.exports = getReply

const Raven = require('raven')
const axios = require('axios')
const redis = require('../persistence').redis
const crypto = require('crypto')
const generateHash = (str) => crypto.createHash('md5').update(str).digest('hex')
Raven.config('https://96d6795013a54f8f852719919378cc59@sentry.io/304046').install()
require('dotenv').config()

class Api {

  static async request (method, url, data) {
    try {
      return (await axios.request({ url, method, baseURL: process.env.API_BASE_URL, data })).data
    } catch (reason) {
      if (reason.response) {
        console.error('(╯°□°）╯︵ ┻━┻ ERROR SENDING REQUEST TO API DB❗ :: \n--> %s\n--> Status Code: %s', reason.response.statusText, reason.response.status)
        return reason
      }
      console.error('❌❌❌ ERROR SENDING REQUEST TO API DB❗ :: \n', reason)
      return reason
    }
  }

/* ***************************************************************************************************************
* ************************************ REDIS DATA STORING FUNCTIONS **********************************************
* ****************************************************************************************************************/

  async userDataToRedis (data, segment) {
    try {
      const userHash = data.userHash
      const userValue = data[segment]

      if (!userHash) { throw new Error('No userHash passed') }
      if (!userValue) { throw new Error('No userValue passed') }

      const create = await redis.hashSetUser(userHash, segment, userValue)
      if (!create) { throw new Error('[Redis] Error while creating') }

      const retrieve = await redis.hashGetUser(userHash)
      return {
        statusMessage: 'created',
        statusCode: 201,
        data: retrieve,
      }
    } catch (reason) {
      if (reason.response) { console.error('(╯°□°）╯ ERROR STORING USER CACHE :: \n--> %s\n--> Status Code: %s', reason.response.statusText, reason.response.status); return reason }
      console.error('(╯°□°）╯ ERROR STORING USER CACHE :: \n', reason)
      return reason
    }
  }

  async getUserFromRedis (userHash) {
    try {
      const user = await redis.hashGetUser(userHash)
      return {
        statusMessage: 'success',
        statusCode: 200,
        data: user,
      }
    } catch (reason) {
      if (reason.response) {
        console.error('❌❌❌ ERROR REQUESTING USER CACHE :: \n--> %s\n--> Status Code: %s', reason.response.statusText, reason.response.status)
        return reason
      }
      console.error('❌❌❌ ERROR REQUESTING USER CACHE :: \n', reason)
      return reason
    }
  }

  async setRedisIds (userHash, slug, value) {
    const data = {}
    data.userHash = userHash
    data[slug] = value
    return this.userDataToRedis(data, slug)
  }

  async setRedisDataPoint (userHash, slug, value) {
    const data = {}
    data.userHash = userHash
    data[slug] = value
    return this.userDataToRedis(data, slug)
  }

  async setRatingCache (userHash, rating_value) {
    return this.userDataToRedis({
      userHash,
      rating_value,
    }, 'rating_value')
  }

/* ************************************************************************************************************
* ************************************ Mongo Database CRUD section ********************************************
* *************************************************************************************************************/

  async createFlow (senderId, newUserData) {
    try {
      // -- Prepare data
      const userHash = generateHash(senderId)
      const userData = newUserData

      Object.keys(userData).forEach(async (index) => {
        const key = index
        const value = userData[key]

        if (!key || !value) { return }

        const create = await redis.hashSetUser(userHash, key, value)
        if (!create) { throw new Error('[Redis] Error while creating') }
      })

      const retrieve = await redis.hashGetUser(userHash)
      return { statusMessage: 'retrieved', statusCode: 200, data: retrieve }
    } catch (reason) {
      console.log('An error occurred❗❗❗ :: ', reason)
    }
  }

  async retrieveFlow (senderId) {
    try {
      const userHash = generateHash(senderId)
      const flow = await redis.hashGetUser(userHash)
      return {
        statusMessage: 'retrieved',
        statusCode: 200,
        data: flow,
      }
    } catch (reason) {
      if (reason.response) {
        console.error('ERROR RETRIEVING USER FLOW FROM REDIS❗❗❗ :: \n--> %s\n--> Status Code: %s', reason.response.statusText, reason.response.status)
      } else {
        console.error('Error retrieving user flow from redis :: ', reason)
      }
    }
  }

  async updateFlow (senderId, update = {
    current_pos: '',
    prev_pos: '',
    next_pos: '',
    open_question: undefined,
    current_flow: undefined,
    last_interaction: Date(),
    awaiting_answer: '0',
    ready_to_reply: true,
    prev_flow: undefined,
    translate_dialog: 'false',
    repeated_this_pos: '0',
    autoresponder_reply: '0',
    autoresponder_type: 'text',
    survey_done: 'no',
    message_delay: 'on',
    reminder_list: '',
    // -- Possible values: unrequested, requested, completed
    tutor_flow_status: undefined,
  }) {
    try {
      // -- Generate the userHash
      const userHash = generateHash(senderId)

      // - Define object containing data to update in REDIS
      const userData = {
        current_pos: update.current_pos,
        open_question: update.open_question,
        prev_pos: update.prev_pos,
        next_pos: update.next_pos,
        current_flow: update.current_flow,
        last_interaction: update.last_interaction,
        awaiting_answer: update.awaiting_answer,
        ready_to_reply: update.ready_to_reply,
        prev_flow: update.prev_flow,
        translate_dialog: update.translate_dialog,
        repeated_this_pos: update.repeated_this_pos,
        autoresponder_reply: update.autoresponder_reply,
        autoresponder_type: update.autoresponder_type,
        survey_done: update.survey_done,
        message_delay: update.message_delay,
        reminder_list: update.reminder_list,
        tutor_flow_status: update.tutor_flow_status,
      }

      Object.keys(userData).forEach(async (index) => {
        const key = index
        const value = userData[key]

        // -- Sanity check
        if (!key || !value) { return }

        const create = await redis.hashSetUser(userHash, key, value)
        if (!create) { throw new Error('[Redis] Error while creating') }
      })

      const retrieve = await redis.hashGetUser(userHash)
      return {
        statusMessage: 'retrieved',
        statusCode: 200,
        data: retrieve,
      }
    } catch (reason) {
      console.log('❌❌❌ ERROR UPDATING USER FLOW AT REDIS :: ', reason.message)
      Raven.captureException(reason)
    }
  }

    // USER collection sub-section

  async createInitialUserProfile (senderId, conversationId) {
    return Api.request('post', 'user/initRegister', { senderId, conversationId })
  }

  async createFullUserProfile (senderId) {
    return Api.request('post', 'user', { senderId })
  }

  async retrieveUser (senderId) {
    return Api.request('get', `user/${senderId}`, undefined)
  }

  async updateUserProfile (senderId, parameters, destination) {
    return Api.request('post', 'user/update_user', { senderId, parameters, destination })
  }

  async updateLevel (conversation_id, update = { level: null }) {
    return Api.request('put', 'user/level', { conversation_id, level: update.level })
  }

  async updateAccent (conversation_id, update = { accent: null }) {
    return Api.request('put', 'user/accent', { conversation_id, accent: update.accent })
  }

  async deleteUser (senderId) {
    return Api.request('put', '/user', { senderId })
  }

  async updateSubscription (conversation_id, update = { product: null, status: null, weeks_paid: null }) {
    return Api.request('put', 'user/subscription', {
      conversation_id,
      product: update.product,
      status: update.status,
      weeks_paid: update.weeks_paid,
    })
  }

  async updateContext (senderId, parameters) {
    return Api.request('post', 'user/update_context', { senderId, parameters })
  }

  async sendRating (senderId) {
    return Api.request('post', '/user/ratingSystemRespond', { senderId })
  }

  async sendLesson (senderId) {
    return Api.request('put', '/user/wrote', { senderId })
  }

  async createTutorRequest (userHash) {
    return Api.request('post', 'tutor_request', { userHash })
  }

  async createSurveyCollection (senderId) {
    return Api.request('post', '/user/saveSurvey', { senderId })
  }

  /**
   * ================================================
   * Save events endpoint
   * ================================================
   */
  async createEvents (dataSet) {
    return Api.request('post', '/events/daily', { dataSet })
  }
}

module.exports = new Api()

/**
 * body:
Body : { message:
{ data: [Object],
__v: 0,
participant: '090d2c07-8149-43a7-94b9-b675593600ab',
conversation: '7a8b6e71-93ea-4f52-9cd3-309a4722be6c',
attachment: [Object],
receivedAt: '2017-11-07T15:57:33.318Z',
isActive: true,
_id: '05346e9c-c9f0-4141-bcbc-33b07ccdd6b7' },
chatId: '473587732847237-1381501021947224',
senderId: '1381501021947224',
mentioned: true,
origin: 'messenger' },
 */

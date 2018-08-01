const axios = require('axios')
const redis = require('../persistence').redis
const crypto = require('crypto')
const generateHash = (str) => crypto.createHash('md5').update(str).digest('hex')
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
    }
  }

    // USER collection sub-section

  async createInitialUserProfile (senderId) {
    return Api.request('post', 'user/initRegister', { senderId })
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

  async deleteUser (senderId) {
    return Api.request('put', '/user', { senderId })
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
/**
 * Global Imports
 * */
const API = require('../../rooCoreApi').rooCoreApi;
const curatedData = require('./curated-data');

class CacheDataPoints {
  async setUserIDsInRedis(senderId, userHash) {
    try {
      await API.setRedisIds(userHash, 'senderId', senderId);
      return 0;
    } catch (e) {
      return e;
    }
  }

  async saveUserDataCache(senderId, userHash, context, slug, value) {
    let valueToStore;
    let res;
    valueToStore = curatedData(value);
    if (!valueToStore) { valueToStore = value; }

    if (context === 'survey') {
      try {
        res = await this.setUserIDsInRedis(senderId, userHash);
        if (res) { throw new Error(`${res}`); }
        await API.setRedisDataPoint(userHash, slug, valueToStore);
        return 0;
      } catch (error) { console.log('(╯°□°）╯ Error in memory :: ', error); return error; }
    } else if (context === 'introduction') {
      switch (slug) {
        case '_heardAboutLangrooDialog1':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'source_type', valueToStore);
            return 0;
          } catch (error) { console.log('Error saving Type of Source where user heard about Roo :: ', error); return error; }

        case '_heardAboutLangrooDialog2':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'source_name', valueToStore);
            return 0;
          } catch (error) { console.log('Error saving Name of Source where user heard about Roo :: ', error); return error; }

        case '_newUser':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'level', valueToStore);
            return 0;
          } catch (error) { console.log('Error saving User English Level :: ', error); return error; }

        case '_alreadyHadACall':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'motivation_to_learn_english', valueToStore);
            return 0;
          } catch (error) { console.log('Error saving User Big Motivation :: ', error); return error; }

        case '_awaitingOurFirstCall':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'motivation_to_learn_english', valueToStore);
            return 0;
          } catch (error) { console.log('Error saving User Big Motivation :: ', error); return error; }

        default:
          console.error('Error saving unidentified data point in the INTRODUCTION CONTEXT');
      }
    } else if (context === 'tutor') {
      switch (slug) {
        case 'initiateUpsellingFlow':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'upselling_flow_input', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'retakePreTutorFromReminder':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'retaking_tutor_flow_input', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'initiatePreTutorFlow':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'tutor_flow_starting_input', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'PTnextWeekOrMonth':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'tutor_flow_when_to_remind', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'PTshowPrices':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'tutor_flow_show_prices_input', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'initiateTutorFlow':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'input_before_confirming_tutor', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'tb0':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'input_before_tutor_flow', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'tutorAskCountryOfUser':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'currentCountry', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'describeYourself':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'selfDescription', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'describeYourInterests':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'interests', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'whenToCallTutor':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'timeOfDayForCalls', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'confirmWhenToCallTutor':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'timeOfDayForCalls', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'whenToCallTutor2':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'timeOfDayForCalls', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'daysGroupForCalls':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'timeOfWeekForCalls', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'daysToCallTutor':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'daysOfWeekForCalls', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'knowThePrice':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'input_know_the_price', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'internetSpeedDescription':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'internet_speed_description', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        case 'userHasNoMoney':
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, 'other_information', valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }

        default:
          try {
            res = await this.setUserIDsInRedis(senderId, userHash);
            if (res) { throw new Error(`${res}`); }
            await API.setRedisDataPoint(userHash, slug, valueToStore);
            return 0;
          } catch (error) { console.log(`Error saving ${slug} redis :: `, error); return error; }
      }
    }
    return 0;
  }

  catch(error) { console.error('❌ Error classifying and storing data at REDIS ❌ ::', error); return error; }
}

module.exports = new CacheDataPoints();

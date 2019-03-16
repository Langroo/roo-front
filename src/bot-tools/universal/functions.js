/**
 * Global Imports
 * */
const translate = require('google-translate-api');
const axios = require('axios');
const cronJobScheduler = require('node-schedule');
const API = require('../../core/index').dbApi;
const replyLauncher = require('../../replyHandler');
require('dotenv').config();

class OneForAll {
  sendNotificationToSlack(url, data) {
    axios.request({
      headers: { 'Content-Type': 'application/json' },
      url,
      method: 'post',
      data,
    })
      .then(() => 0)
      .catch(err => err);
  }

  async translateReply(reply, lang, skipTranslationIndex = [], dontTranslate = /^undefined$/) {
    let replyTranslated;
    let firstPiece;
    let secondPiece;
    let toTranslate;

    for (let i = 0; i < reply.length; i++) {
      if (skipTranslationIndex.indexOf(i) === -1) {
        if (reply[i].type === 'text') {
          if (reply[i].content.search(dontTranslate) > -1) {
            firstPiece = reply[i].content.split(dontTranslate)[0];
            secondPiece = reply[i].content.split(dontTranslate)[1];
            toTranslate = `${firstPiece} ${secondPiece}`;
            toTranslate = await translate(toTranslate, { to: lang });
            if (!toTranslate) { toTranslate = `${firstPiece} ${secondPiece}`; }
            replyTranslated = toTranslate.text.replace('""', `"${dontTranslate}"`);
            reply[i] = Object.assign({}, reply[i], { content: replyTranslated });
          } else {
            replyTranslated = await translate(reply[i].content, { to: lang });
            reply[i] = Object.assign({}, reply[i], { content: replyTranslated.text });
          }
        } else if (reply[i].type === 'quickReplies') {
          if (reply[i].content.title.search(dontTranslate) > -1) {
            firstPiece = reply[i].content.title.split(dontTranslate)[0];
            secondPiece = reply[i].content.title.split(dontTranslate)[1];
            toTranslate = `${firstPiece} ${secondPiece}`;
            toTranslate = await translate(toTranslate, { to: lang });
            replyTranslated = toTranslate.text.replace('""', `"${dontTranslate}"`);
            reply[i] = Object.assign({}, reply[i], {
              content: {
                title: replyTranslated,
                buttons: reply[i].content.buttons,
              },
            });
          } else {
            replyTranslated = await translate(reply[i].content.title, { to: lang });
            reply[i] = Object.assign({}, reply[i], {
              content: {
                title: replyTranslated.text,
                buttons: reply[i].content.buttons,
              },
            });
          }

          const translatedButtons = [];
          for (let buttonObject of reply[i].content.buttons) {
            replyTranslated = await translate(buttonObject.title, { to: lang });
            buttonObject = Object.assign({}, buttonObject, { title: replyTranslated.text });
            translatedButtons.push(buttonObject);
          }
          reply[i].content.buttons = translatedButtons;
        }
      }
    }
    return await reply;
  }

  shuffle(array) {
    let m = array.length;


    let t; let
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  async textToAudio(text, senderId, gender = 'male', accent = 'uk') {
    try {
      const audioFileURL = (await axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: `${process.env.PYBRAIN_BASE_URL}/pronunciation`,
        method: 'post',
        data: `{ "text": "${text}", "senderId": "${senderId}", "gender": "${gender}", "accent": "${accent}" }`,
      })).data.data;
      console.info('🔊 Pronunciation requested 📞');
      if (!audioFileURL) {
        console.error('The Pybrain failed to generate the URL for the audio');
        return false;
      }
      return audioFileURL.fileUrl;
    } catch (reason) {
      console.log('ERROR REQUESTING TEXT TO AUDIO TO PYBRAIN :: ', reason);
    }
  }

  killCronJob(entity, senderId) {
    const cronId = senderId + entity;
    const h = cronJobScheduler.scheduledJobs[cronId];
    if (h) {
      h.cancel();
      console.log('Cronjob %s canceled.', cronId);
    }
  }

  async CronMessage(entity, replyToSend, timeToSend, flowToUpdate, senderId, userFromDB) {
    const cronId = senderId + entity;
    const h = cronJobScheduler.scheduledJobs[cronId];
    if (h) {
      h.cancel();
      console.log('Cronjob %s canceled.', cronId);
    }
    const timeOfSending = new Date(timeToSend);
    console.info('Date of next delayed message: [%s] ⌛', timeOfSending);
    cronJobScheduler.scheduleJob(cronId, timeOfSending, async () => {
      try {
        await API.updateFlow(senderId, flowToUpdate);
        await replyLauncher.replier(0, replyToSend, userFromDB, senderId);
        await API.updateFlow(senderId, { ready_to_reply: true });
        console.info('✔✔ Delayed reply sent successfully ✔✔');
      } catch (error) { console.error('❌❌❌ Error sending the scheduled message ::', error); }
    });
  }

  async CronReminder(entity, replyToSend, delayTime, flowToUpdate, senderId, userFromDB) {
    const cronId = senderId + entity;
    const h = cronJobScheduler.scheduledJobs[cronId];
    if (h) {
      h.cancel();
      console.log('Cronjob %s canceled.', cronId);
    }
    const timeOfSending = new Date(Date.now() + (delayTime * 1000));
    if (delayTime < 60) {
      console.info('In %s ⌛ seconds a reply will be sent.', delayTime);
    } else if (delayTime > 60 && delayTime < 3600) {
      console.info('In %s ⌛ minutes a reply will be sent.', delayTime / 60);
    } else if (delayTime > 3600) {
      console.info('In %s ⌛ hours a reply will be sent.', delayTime / 3600);
    }
    cronJobScheduler.scheduleJob(cronId, timeOfSending, async () => {
      try {
        const userHasNotReplied = (await API.retrieveFlow(senderId)).data.current_pos === entity;
        if (userHasNotReplied) {
          await API.updateFlow(senderId, flowToUpdate);
          await replyLauncher.replier(0, replyToSend, userFromDB, senderId);
          await API.updateFlow(senderId, { ready_to_reply: true });
          console.info('✔✔ Delayed reply sent successfully ✔✔');
        } else {
          console.info('👤 User has replied to the bot, timed message will not be sent ⛔');
        }
      } catch (error) { console.error('❌❌❌ Error sending the scheduled message ::', error); }
    });
  }

  async CronFunction(time, callback, params, senderId) {
    const timeOfSending = new Date(Date.now() + (time * 1000));
    cronJobScheduler.scheduleJob(timeOfSending, async () => {
      if (params) {
        const functionStatus = callback(senderId, params);
      } else {
        const functionStatus = callback(senderId);
      }
      console.log('[Notice] -> Delayed function called successfully');
    });
  }
}

module.exports = OneForAll;

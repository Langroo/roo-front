const Bot = require('messenger-bot');
const { getUserDialogues, getAdminDialogues } = require('./replyHandler');
const OneForAll = require('./bot-tools').OneForAll;

const bot = new Bot({
  token: process.env.FB_ACCESS_TOKEN,
  verify: process.env.FB_VERIFY_TOKEN,
  app_secret: process.env.FB_APP_SECRET,
});

const checkForAdminInput = (payload, text) => {
  const adminRegex = /(activate message delay|deactivate message delay|roo masters 101)/i;
  if (adminRegex.test(text)) {
    getAdminDialogues(text, payload.sender.id);
    console.info('<< Admin Request received and processed >>');
    return 1;
  }
  return 0;
};

const checkForHashTags = (profile, text) => {
  const helpRegex = /(#team|#help)/ig;
  if (helpRegex.test(text)) {
    const slackSmash = new OneForAll();
    const data = `{"text":"User ${profile.first_name} ${profile.last_name} request for *HELP*: _${text}_"}`;
    const url = process.env.ASKROO_SLACK_URL;
    const error = slackSmash.sendNotificationToSlack(url, data);
    if (error) { throw error; }
    return 1;
  }
  return 0;
};

/**
* @description This function verifies that the user has a profile in facebook and then replies
* @param {Object} payload
* */
const botReplier = (payload) => {
  const slackSmash = new OneForAll();
  let text;
  if (payload.message) {
    payload.message.quick_reply
      ? text = payload.message.quick_reply.payload
      : text = payload.message.text;
  }

  if (payload.postback) { text = payload.postback.payload; }
  bot.getProfile(payload.sender.id, (err, profile) => {
    console.log('\n############### USER INPUT DATE ##############\n[%s]', Date());

    payload.profile = profile;
    if (checkForHashTags(profile, text) || checkForAdminInput(payload, text)) { return 0; }
    getUserDialogues(payload, text);
  }).catch((problem) => {
    console.log('Problem with getProfile function:', problem);
    bot.sendMessage(payload.sender.id, {
      text: 'Hello friend 👋! Thanks for trying me out 😁👍!\nUnfortunately, because of Facebook, Messenger or the device 📱 you are using, I cannot function properly 😟 and give you the full Langroo Experience.\nSend me a message with the hashtag #help and a member of our team will contact you to figure out the issue and solve it! ☺👌',
    },
    slackSmash.sendNotificationToSlack(
      process.env.DEPLOYMENT_INFO_SLACK_URL,
      `{"text":"User with ID ${payload.sender.id} has an issue with this Facebook Public Profile: ${problem}"}`,
    ),
    'RESPONSE',
    'ISSUE_RESOLUTION');
  });
};

// -- Chatbot referral handling (when users use the m.link)
bot.on('referral', (payload, reply, actions) => botReplier(payload, reply, actions));

// -- Chatbot Error handling
bot.on('error', err => console.log(err.message));

// -- Chatbot actions for user postbacks
bot.on('postback', (payload, reply, actions) => botReplier(payload, reply, actions));

// -- Chatbot actions for user input
bot.on('message', (payload, reply) => botReplier(payload, reply));

// -- Chatbot actions when Facebook informs correct delivery of the message
bot.on('delivery', () => console.log('Facebook informs correct delivery of the message'));

// -- Handle user Input / Postback
const interact = (req) => {
  try {
    bot._handleMessage(req.body);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      console.log('\nError with bot._handleMessage at Director Module: ', err);
    }
  }
};

// -- Verify Webhook authenticity with Facebook
const verify = (req, res) => bot._verify(req, res);

module.exports = { interact, verify };

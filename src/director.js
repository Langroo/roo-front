const Bot = require('messenger-bot');
const ReplyHandler = require('./reply.handler');
const OneForAll = require('./bot-tools').OneForAll;

const bot = new Bot({
  token: process.env.FB_ACCESS_TOKEN,
  verify: process.env.FB_VERIFY_TOKEN,
  app_secret: process.env.FB_APP_SECRET,
});

const checkForAdminInput = (payload, text) => {
  // -- Variable to check for specific admin related input
  const adminRegex = /(activate message delay|deactivate message delay|roo masters 101)/i;

  // -- Handle ADMIN input
  if (adminRegex.test(text)) {
    ReplyHandler.adminDialogs(text, payload.sender.id);
    console.info('<< Admin Request received and processed >>');
    return 1;
  }
  return 0;
};

const checkForHashTags = (profile, text) => {
  // -- Variable to check for specific hashtags in user input
  const helpRegex = /(#team|#help)/ig;

  // -- Notify Slack Bot-Notifications channel if helpRegex is detected in user input
  if (helpRegex.test(text)) {
    // -- Instantiation of our Smash to Slack
    const slackSmash = new OneForAll();

    // -- Define our message to send to Slack and the URL
    const data = `{"text":"User ${profile.first_name} ${profile.last_name} request for *HELP*: _${text}_"}`;
    const url = process.env.ASKROO_SLACK_URL;

    // -- Send message to Slack and collect the error if any
    const error = slackSmash.sendNotificationToSlack(url, data);
    if (error) { throw error; }
    return 1;
  }
  return 0;
};

const botReplier = (payload, reply, actions = null) => {
  // -- Instantiation of our Smash to Slack
  const slackSmash = new OneForAll();

  // -- Define constants for message content and help regex
  let text;
  if (payload.message) {
    payload.message.quick_reply
      ? text = payload.message.quick_reply.payload
      : text = payload.message.text;
  }

  if (payload.postback) { text = payload.postback.payload; }

  // -- Retrieve the user profile and then proceed
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { throw err; }
    // -- Log user's input date
    console.log('\n############### USER INPUT DATE ##############\n[%s]', Date());
    // -- Add the user profile to the payload object
    payload.profile = profile;

    // -- Define the env SENDER_ID to pass data to Chatbase
    process.env.SENDER_ID = payload.sender.id;

    // -- Verify input for user hashtags or admin input
    if (checkForHashTags(profile, text)) { return 0; }
    if (checkForAdminInput(payload, text)) { return 0; }

    // -- Handle User Input and Return Replies
    ReplyHandler.userDialogs(payload, text);
  })
    .catch(() => bot.sendMessage(payload.sender.id, {
      text: 'Hello friend 👋! Thanks for trying me out 😁👍!\nUnfortunately, because of Facebook, Messenger or the device 📱 you are using, I cannot function properly 😟 and give you the full Langroo Experience.\nSend me a message with the hashtag #help and a member of our team will contact you to figure out the issue and solve it! ☺👌',
    },
    slackSmash.sendNotificationToSlack(
      process.env.DEPLOYMENT_INFO_SLACK_URL,
      `{"text":"User with ID ${payload.sender.id} has an issue with this Facebook Public Profile"}`,
    ),
    'RESPONSE',
    'ISSUE_RESOLUTION'));
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
bot.on('delivery', (payload, reply, actions) => console.log('Facebook informs correct delivery of the message'));

// -- Handle user Input / Postback
const interact = (req, res) => {
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

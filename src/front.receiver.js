const replyLauncher = require('./replyLauncher')
const Bot = require('messenger-bot')

const bot = new Bot({
  token: process.env.FB_ACCESS_TOKEN,
  verify: process.env.FB_VERIFY_TOKEN,
  app_secret: process.env.FB_APP_SECRET,
})

const botReplier = (payload, reply, actions = null) => {

  const text = payload.message.text

  // -- Define the env variable to pass data to Chatbase
  process.env.SENDER_ID = payload.sender.id

  const conversation = { source: text }

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { throw err }
    payload.profile = profile
  })

  const adminRegex = /(activate message delay|deactivate message delay|roo masters 101)/i

  // -- Handle ADMIN input
  if (adminRegex.test(conversation.source)) {
    replyLauncher.adminDialogs(conversation.source, payload.sender.id)
    console.info('<< Admin Request received and processed >>')
  }

  // -- Register the date and hour of this message in the logs
  const userInputDate = new Date()
  console.log('\n############# USER INPUT DATE \n[%s]############', userInputDate)

  // -- Handle User Input and Return Replies
  replyLauncher.flowLauncher(payload, conversation)

}

// -- Chatbot Error handling
bot.on('error', (err) => console.log(err.message))

// -- Chatbot actions for user postbacks
bot.on('postback', (payload, reply, actions) => botReplier(payload, reply, actions))

// -- Chatbot actions for user input
bot.on('message', (payload, reply) => botReplier(payload, reply))

// -- Chatbot actions when Facebook informs correct delivery of the message
bot.on('delivery', (payload, reply, actions) => console.log('Facebook informs correct delivery of the message'))

// -- Handle user Input / Postback
const interact = (req, res) => bot._handleMessage(req.body)

// -- Verify Webhook authenticity with Facebook
const verify = (req, res) => bot._verify(req, res)

module.exports = { interact, verify }

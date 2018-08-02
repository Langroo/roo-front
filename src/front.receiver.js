const replyLauncher = require('./replyLauncher')
const Bot = require('messenger-bot')

const bot = new Bot({
  token: process.env.FB_ACCESS_TOKEN,
  verify: process.env.FB_VERIFY_TOKEN,
  app_secret: process.env.FB_APP_SECRET,
})

const botReplier = (payload, reply, actions = null) => {

  // -- Define constants for message content and help regex
  let text
  console.log('THIS IS THE PAYLOAD :: ', payload)
  if (payload.message) { text = payload.message.text }
  if (payload.message.quick_reply) { text = payload.message.quick_reply.payload }
  if (payload.postback) { text = payload.postback.payload }
  const helpRegex = /#help/ig

  // -- Return and avoid processing user input if hashtag #help is detected
  if (helpRegex.test(text)) { return 0 }

  // -- Retrieve the user profile and then proceed
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { throw err }

    // -- Add the user profile to the payload object
    payload.profile = profile

    // -- Define the env variable to pass data to Chatbase
    process.env.SENDER_ID = payload.sender.id

    // -- Set the Raw Input
    const conversation = { source: text }

    const adminRegex = /(activate message delay|deactivate message delay|roo masters 101)/i

    // -- Handle ADMIN input
    if (adminRegex.test(conversation.source)) {
      replyLauncher.adminDialogs(conversation.source, payload.sender.id)
      console.info('<< Admin Request received and processed >>')
    }

    // -- Register the date and hour of this message in the logs
    const userInputDate = new Date()
    console.log('\n############## USER INPUT DATE #############\n[%s]', userInputDate)

    // -- Handle User Input and Return Replies
    replyLauncher.flowLauncher(payload, conversation)

  })

}

// -- Chatbot referral handling (when users use the m.link)
bot.on('referral', (payload, reply, actions) => botReplier(payload, reply, actions))

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

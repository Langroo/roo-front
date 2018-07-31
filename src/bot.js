const replyLauncher = require('./replyLauncher')
const recastai = require('recastai').default
const client = new recastai(process.env.REQUEST_TOKEN)

/**
 * The Bot Creator
 */
class bot {
  constructor (req, res) {
    this.request = req
    this.response = res
    process.env.SENDER_ID = req.body.senderId
    process.env.USER_CONV = req.body.message.conversation
  }

  replyMessage (message) {
    const conversation = { source: message.content }
    const adminRegex = /(activate message delay|deactivate message delay|roo masters 101)/i

    // -- Handle INBOX input from PAGE ADMINS
    if (message.message.attachment.isAdminMessage) {
      console.info('<< An Admin from the Facebook Page is answering to a user using the INBOX >>\n(!) INPUT IGNORED (!) ')
      return []
    }

    // -- Handle ADMIN input
    if (adminRegex.test(conversation.source)) {
      replyLauncher.adminDialogs(conversation.source, message.senderId)
      console.info('<< Admin Request received and processed >>')
      return []
    }

    // -- Register the date and hour of this message in the logs
    const userInputDate = new Date()
    console.log('\n############# USER INPUT DATE \n[%s]############', userInputDate)

    // -- Handle User Input and Return Replies
    replyLauncher.flowLauncher(message, conversation)
    return []
  }

  reply () {
    return client.connect.handleMessage(this.request, this.response, this.replyMessage)
  }
}

module.exports = bot

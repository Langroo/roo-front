const fs = require('fs')
const mkdirp = require('mkdirp')

class fileHandlers {

  static conversationLogger (senderId, name, userInput, isPostback, channel) {

    mkdirp('./conversation_logs', (error) => {
      if (error) { console.error('Unable to create conversation_logs folder', error) }
    })

    const fileline = `${senderId};;${name};;${userInput};;${isPostback};;${Date.now()}\n`
    fs.appendFile(`./conversation_logs/${channel}_${senderId}.txt`, fileline, (error) => {
      if (error) { console.error('Error creating/updating conversation log for user [%s] at date [%s]', name, Date()) }
    })
  }

}

module.exports = fileHandlers

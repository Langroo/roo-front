const replyChooser = (replyName, senderName) => {

  const replies = {
    quizReceivedReply: [
      { type: 'text', content: `Woohoo! 🎊 Your answer is received ${senderName}!` },
    ],
    mustRegisterFirst: [
      { type: 'text', content: `Hold on ${senderName} ✋! You're too quick 😮, I'll let you use that option 📲 once we are finished here 👍.` },
      { type: 'text', content: 'Woah, before I can let you use that option, I need you to tell me a few things first 😁☝' },
    ],
    contentFailMsg: [
      { type: 'text', content: 'Hey! here\'s a cute puppy while send your answer!' },
      { type: 'image', content: 'https://media1.tenor.com/images/14118ed1c1c575626587eecf4edbfa5b/tenor.gif?itemid=8804026' },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

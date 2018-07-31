const replyChooser = (replyName, senderName, choice = 'that') => {
  const OneForAll = require('../../../bot-tools').OneForAll
  // -- Import of OneForAll
  const controllerSmash = new OneForAll()

  const randomResponses = [
    { type: 'text', content: 'So 😀, as I was saying' },
    { type: 'text', content: 'I know we got lost in conversation 😆' },
    { type: 'text', content: 'What did I ask you again? 😶Ow yeah ☝️' },
    { type: 'text', content: `So ${senderName}` },
  ]

  const replies = {
    mustRegisterFirst: [
      { type: 'text', content: `Hold on ${senderName} ✋! You're too quick 😮, I'll let you use that option 📲 once we are finished here 👍.` },
      { type: 'text', content: 'Woah, before I can let you use that option, I need you to tell me a few things first 😁☝' },
    ],
    FinalContentMsg: [
      { type: 'text', content: `Hey ${senderName}, you have reached your daily limit! 👏🔒 Tomorrow you will be able to learn 10 more phrases! 😀` },
    ],
    contentFailMsg: [
      { type: 'text', content: 'Hey! it seems something unfortunate happened getting your content, here\'s a cute puppy while I fix this.' },
      { type: 'image', content: 'https://media1.tenor.com/images/14118ed1c1c575626587eecf4edbfa5b/tenor.gif?itemid=8804026' },
    ],
    retakeLesson: [
      { type: 'text', content: `${controllerSmash.shuffle(randomResponses)[0].content},✏ write "Next Phrase", when you want to continue 😉` },
    ],
    afterGeneralFunctionReply: [
      { type: 'text', content: `I see you're using some of my other features ${senderName} :D, write LEARN anytime when you want to continue learning ➡` },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

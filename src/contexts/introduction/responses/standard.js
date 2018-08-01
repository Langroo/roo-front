const replyChooser = (replyName, senderName, choice = 'this') => {
  // -- Required imports
  const OneForAll = require('../../../bot-tools').OneForAll
  // -- Instantiation of classes
  const controllerSmash = new OneForAll()

  // -- Dialogs
  const randomResponses = [
      { type: 'text', content: 'So 😀, as I was saying... ' },
      { type: 'text', content: 'I know we got lost in conversation 😆, but...' },
      { type: 'text', content: 'What did I ask you again? 😶Ow yeah ☝️ ...' },
      { type: 'text', content: `I was waiting for you to respond below ${senderName} 😁👇` },
      { type: 'text', content: 'Retaking the subject:' },
  ]

  const replies = {
    gifForReminder: [
      { type: 'image', content: 'https://media1.tenor.com/images/8acbf610c2eecb9c333ef9d1e2039342/tenor.gif?itemid=5058950' },
    ],
    reliefOfUserContinuing: [
      { type: 'text', content: 'Phew! ☺️🙏' },
      { type: 'image', content: 'https://media1.tenor.com/images/6506e0b55eba4fceb4d4fb0a9c14bd5a/tenor.gif?itemid=10246345' },
      { type: 'text', content: 'haha, I thought we were lost forever! 💔' },
      { type: 'text', content: controllerSmash.shuffle(randomResponses)[0].content },
    ],
    getStarted: [
      { type: 'text', content: `Welcome to Langroo ${senderName}! 🎉` },
      { type: 'image', content: 'https://media1.tenor.com/images/57f516f712b25d1fa534dd4e0999e92e/tenor.gif?itemid=12179567' },
      { type: 'text', content: 'How are you?' },
    ],
    introDialog2: [
      { type: 'text', content: '😀😀' },
      { type: 'text', content: `So ${senderName}, let me introduce myself` },
      { type: 'text', content: 'I’m Roo, an AI chatbot which helps you to learn English like a native person! 🙅' },
      { type: 'text', content: 'Who are you?' },
    ],
    introDialog3: [
      { type: 'text', content: '👍👍' },
      { type: 'text', content: 'Well, who is the Langroo team?' },
      { type: 'text', content: 'Here is a welcome video for you! 📹' },
      { type: 'video', content: 'https://s3.amazonaws.com/langroo/videos/video_of_the_day1.mp4' },
      { type: 'delay', content: 20 },
      { type: 'text', content: 'We send members of the Langroo community a daily quiz ⁉️' },
      { type: 'text', content: 'And every day a winner gets a free 15 minute video class with a tutor! 🏆🙋' },
      { type: 'text', content: 'Ready to start?' },
    ],
    introDialog4: [
      { type: 'quickReplies',
        content: {
          title: 'Well then, what’s the one biggest thing we can help you with? ☺️',
          buttons: [
            { title: 'Work 💻', value: 'motivation is work' },
            { title: 'Social Life 😃', value: 'motivation is social life' },
            { title: 'University 🏫', value: 'motivation is university' },
            { title: 'School 🎒', value: 'motivation is school' },
            { title: 'Exams 📝', value: 'motivation is english exams' },
            { title: 'Interviews 💵', value: 'motivation is job interviews' },
            { title: 'Travel ✈', value: 'motivation is travel' },
            { title: 'Other ✏', value: 'motivation is other and will be asked' },
          ],
        },
      },
    ],
    introDialog4Branch1: [
      { type: 'text', content: 'Nice, tell me more please 😄' },
    ],
    introDialog5: [
      { type: 'audio', content: 'Before we help you with that, what’s your English level right now?' },
      { type: 'quickReplies',
        content: {
          title: 'Before we help you with that, what’s your English level right now? 😬',
          buttons: [
            { title: 'Bad (beginner) 👎', value: 'pd_beginner_level' },
            { title: 'Ok (intermediate) 👍', value: 'pd_intermediate_level' },
            { title: 'Great (advanced) 👌', value: 'pd_advanced_level' },
          ],
        },
      },
    ],
    introDialog6: [
      { type: 'quickReplies',
        content: {
          title: 'Finally, to help find more people like you ☝️ How did you hear about Langroo? 📣',
          buttons: [
            { title: 'Influencer 🌟', value: 'Found Roo by Influencer' },
            { title: 'Social Media 📲', value: 'Found Roo from Social Media' },
            { title: 'Search 🔍', value: 'Found Roo Searching' },
            { title: 'Article 📰', value: 'Found Roo from Article' },
            { title: 'Other', value: 'Found Roo by other means' },
          ],
        },
      },
    ],
    introDialog7: [
      { type: 'text', content: 'Hmm… Can you specify? 🙂' },
    ],
    introFinal: [
      { type: 'text', content: `${senderName}` },
      { type: 'text', content: 'You are now OFFICIALLY ready to start 📱👏' },
      { type: 'text', content: 'I will send the Daily Quiz tomorrow at 12 p.m. GMT +0 ⌚' },
      { type: 'text', content: 'Then… the day’s results will be at 14:00 GMT +0 📊' },
    ],
    jumpToTutorFlow: [
      { type: 'text', content: 'Great! 👏' },
      { type: 'quickReplies',
        content: {
          title: 'So, are you ready to give me some more details for your tutor request? 👩',
          buttons: [
            { title: 'Sure', value: 'jump_from_intro_to_tutor' },
            { title: 'No', value: 'keep_going_with_intro_flow' },
          ],
        },
      },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

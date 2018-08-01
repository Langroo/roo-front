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
      { type: 'delay', content: 10 },
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
    rooIntroduction: [
      { type: 'text', content: 'My name’s Bond, James Bond. 🎩' },
      { type: 'text', content: 'Just joking, haha!' },
      { type: 'text', content: 'My nickname is Roo. I’m an English chatbot teacher here on Messenger ;)' },
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/roo_logo_plane.png' },
      { type: 'quickReplies',
        content: {
          title: `I can specialise in British or American English ${senderName}, which do you prefer? 😋`,
          buttons: [
            { title: 'British 🇬🇧', value: 'uk_accent_opt' },
            { title: 'American 🇺🇸', value: 'us_accent_opt' },
          ],
        },
      },
    ],
    tellHowRooCanHelp: [
      { type: 'audio', content: 'As you wish!' },
      { type: 'text', content: 'As you wish!' },
      { type: 'text', content: 'Want to know how I can help you? 😁' },
    ],
    whyRooIsDifferent: [
      { type: 'text', content: 'Well, until now, this was most people’s reaction when studying English: 📚' },
      { type: 'image', content: 'https://media1.tenor.com/images/638aa37a11f9fac63b79337ad725be24/tenor.gif?itemid=3553193' },
      { type: 'audio', content: 'But, not until I was created' },
      { type: 'quickReplies',
        content: {
          title: 'But, not until I was created! 💥',
          buttons: [
            { title: 'Why?', value: 'why different' },
          ],
        },
      },
    ],
    rooLocationQuestion: [
      { type: 'audio', content: 'Do we have mutual friends?' },
      { type: 'quickReplies',
        content: {
          title: 'Do we have mutual friends?😂 How did you hear about me?',
          buttons: [
            { title: 'Search 🔍', value: 'Found Roo Searching' },
            { title: 'School 🎒', value: 'Found Roo from School' },
            { title: 'Facebook Group 👥', value: 'Found Roo from Facebook Group' },
            { title: 'Influencer 👸', value: 'Found Roo by Influencer' },
            { title: 'Other', value: 'Found Roo by other means' },
          ],
        },
      },
    ],
    rooSpecifyInfluencer: [
      { type: 'text', content: 'Ow, please mention who? Love hearing about my celebrity friends! 🙌' },
    ],
    rooSpecifyLocation: [
      { type: 'text', content: 'Ow can you enter the name please? :P' },
    ],
    rooEnglishLevelQuestion: [
      { type: 'audio', content: 'What’s your English level right now?' },
      { type: 'quickReplies',
        content: {
          title: 'What’s your English level right now? 😬',
          buttons: [
            { title: 'Bad (beginner) 👎', value: 'pd_beginner_level' },
            { title: 'Ok (intermediate) 👍', value: 'pd_intermediate_level' },
            { title: 'Great (advanced) 👌', value: 'pd_advanced_level' },
          ],
        },
      },
    ],
    rooBigInterest: [
      { type: 'quickReplies',
        content: {
          title: 'Good, I’ll help you improve ;) Finally 😬, what’s your one biggest interest? ',
          buttons: [
            { title: 'Sports ⚽️', value: 'interested in Sports' },
            { title: 'Reading/Learning 📚', value: 'interested in Reading/Learning' },
            { title: 'Series/Films 🎬', value: 'interested in Series/Films' },
            { title: 'Music 🎵', value: 'interested in Music' },
            { title: 'Travelling ✈', value: 'interested in Travelling' },
            { title: 'Other', value: 'other interest and will ask' },
          ],
        },
      },
    ],
    rooOtherInterest: [
      { type: 'text', content: '😯 I\'m curious, what other interest do you have? 😊' },
    ],
    introFinal: [
      { type: 'audio', content: 'Great' },
      { type: 'text', content: 'Great! 👏' },
      { type: 'audio', content: 'are you ready to start learning?' },
      { type: 'quickReplies',
        content: {
          title: 'So, are you ready to start learning?! 🚀',
          buttons: [
            { title: 'Sure 👍', value: 'on_demand_content_messages' },
            { title: 'Later 😅', value: 'start_content_later_intro' },
          ],
        },
      },
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
    introStartLater: [
      { type: 'text', content: `No problem ${senderName}, just write NEXT PHRASE when you want to start ;) ;)` },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

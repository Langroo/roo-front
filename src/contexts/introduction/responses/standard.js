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
      { type: 'text', content: `Hey ${senderName}! 👋` },
    ],
    howAreYouReply: [
      { type: 'text', content: 'How are you? 😜' },
    ],
    userSpeakLanguage: [
      { type: 'text', content: `So ${senderName} 😁, I see that you speak ${choice}? ` },
      { type: 'text', content: `I’m sorry, I don’t know ${choice} very well. But, if you want we can speak 🔉 in ${choice}. That way you will understand everything!` },
      { type: 'text', content: 'What do you think?' },
      { type: 'quickReplies',
        content: {
          title: 'Press a button below 👇',
          buttons: [
            { title: `${choice}`, value: 'start_other_language' },
            { title: 'Start English', value: 'start_english_language' },
          ],
        },
      },
    ],
    askWhoIsRoo: [
      { type: 'text', content: 'Well, I am going to...' },
      { type: 'image', content: 'https://media1.tenor.com/images/04b5971f0b024a6f59ab3972a254f491/tenor.gif?itemid=7547057 ' },
      { type: 'text', content: 'Do you know who I am?' },
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
    whatRooTeaches: [
      { type: 'text', content: 'Me and my team’s 👱🏻🙍🏾 mission 🚀is for you to' },
      { type: 'text', content: 'LEARN' },
      { type: 'text', content: 'CONVERSATIONAL' },
      { type: 'text', content: 'ENGLISH' },
      { type: 'text', content: 'FASTER! 💥' },
      { type: 'quickReplies',
        content: {
          title: `Especially here in the ${choice}! ;)`,
          buttons: [
            { title: 'How can I start? 😱', value: 'how can I start with Roo' },
          ],
        },
      },
    ],
    willAskQuestions: [
      { type: 'text', content: 'I want to ask you some questions to understand you better! 📝' },
      { type: 'audio', content: 'Ready?' },
      { type: 'text', content: 'Ready? ;)' },
    ],
    rooAgeQuestion: [
      { type: 'quickReplies',
        content: {
          title: `What age are you ${senderName}? 🌱  Click a button below 👇`,
          buttons: [
            { title: '14-18', value: 'user_age_14_to_18' },
            { title: '19-23', value: 'user_age_19_to_23' },
            { title: '24-30', value: 'user_age_24_to_30' },
            { title: '31-40', value: 'user_age_31_to_40' },
            { title: '41-50', value: 'user_age_41_to_50' },
            { title: '51+', value: 'user_age_51_or_more' },
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
    rooBigMotivQuestion: [
      { type: 'quickReplies',
        content: {
          title: 'Great. 👍Why do you want to improve your English? 😛',
          buttons: [
            { title: 'Work 💻', value: 'motivation is work' },
            { title: 'School 🎒', value: 'motivation is school' },
            { title: 'University 🏫', value: 'motivation is university' },
            { title: 'Fun/Challenge 😃', value: 'motivation is fun or challenge' },
            { title: 'English Exams 📝', value: 'motivation is english exams' },
            { title: 'Job Interviews 💵', value: 'motivation is job interviews' },
            { title: 'Other', value: 'motivation is other and will be asked' },
          ],
        },
      },
    ],
    rooOtherMotivation: [
      { type: 'text', content: 'Ow, what is it? 😄' },
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
    introAltFinal: [
      { type: 'text', content: `Ok ${senderName} 👍` },
      { type: 'quickReplies',
        content: {
          title: 'Then, are you ready to start learning?! 🚀',
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

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
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/hello_woman_kitchen_.gif' },
      { type: 'text', content: 'How are you?' },
    ],
    _introduceMyselfDialog: [
      { type: 'text', content: '😀😀' },
      { type: 'text', content: `So ${senderName}, let me introduce myself` },
      { type: 'text', content: 'I’m Roo, a chatbot which helps you to understand native English people! 👂🏼📲' },
      { type: 'text', content: 'Who are you?' },
    ],
    _welcomeVideoDialog: [
      { type: 'text', content: '👍👍' },
      { type: 'text', content: 'Well, here’s an intro VIDEO from Tim on the Langroo team! 👨👩🏽 🎉' },
      { type: 'video', content: 'https://s3.amazonaws.com/langroo/videos/video_of_the_day1.mp4' },
      { type: 'delay', content: 40000 },
      { type: 'quickReplies',
        content: {
          title: 'Want to know more? 😛',
          buttons: [
            { title: 'YES', value: 'yes, know more' },
          ],
        },
      },
    ],
    _englishQuizDialog: [
      { type: 'text', content: 'Me and our team of tutors send you a comprehension quiz every Monday-Friday! 📝💪' },
      { type: 'text', content: 'And if you get the answers right & the fastest YOU WIN A PRIZE! 🏆' },
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/boxing-ring-champion.gif' },
      { type: 'text', content: 'Are you ready to get started....?' },
    ],
    _motivationToLearnDialog: [
      { type: 'text', content: 'Awesome!!! 🚀' },
      { type: 'text', content: 'But, I want to understand you a bit more first' },
      { type: 'text', content: 'So...' },
      { type: 'quickReplies',
        content: {
          title: 'Why are you learning English? ☺️',
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
    _otherMotivationDialog: [
      { type: 'text', content: 'Nice, tell me more please 😄' },
    ],
    _englishLevelDialog: [
      { type: 'text', content: 'Oooh…..' },
      { type: 'quickReplies',
        content: {
          title: 'Before I help you with that, what’s your English level right now? 😅',
          buttons: [
            { title: 'Bad (beginner) 👎', value: 'pd_beginner_level' },
            { title: 'Ok (intermediate) 👍', value: 'pd_intermediate_level' },
            { title: 'Great (advanced) 👌', value: 'pd_advanced_level' },
          ],
        },
      },
    ],
    _heardAboutLangrooDialog1: [
      { type: 'text', content: 'To help find more people like you...' },
      { type: 'quickReplies',
        content: {
          title: 'How did you hear 👂 about Langroo?',
          buttons: [
            { title: 'Influencer 🌟', value: 'Found Roo by Influencer' },
            { title: 'Social Media 📲', value: 'Found Roo from Social Media' },
            { title: 'Friend 👨', value: 'Found Roo from a Friend' },
            { title: 'Facebook Group 📱', value: 'Found Roo from a Facebook Group' },
            { title: 'Search 🔍', value: 'Found Roo Searching' },
            { title: 'Article 📰', value: 'Found Roo from Article' },
            { title: 'Other', value: 'Found Roo by other means' },
          ],
        },
      },
    ],
    _heardAboutLangrooDialog2: [
      { type: 'text', content: 'Hmm… Can you tell me exactly? 🙂' },
    ],
    _userAllDoneDialog: [
      { type: 'text', content: `${senderName}..........` },
      { type: 'text', content: 'You are now a part of the Langroo COMMUNITY 🎉' },
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/wolfpack-guys-group-walking.gif' },
      { type: 'text', content: 'Do you know how the quiz works?' },
    ],
    _howQuizWorksDialog: [
      { type: 'text', content: 'The quiz will get sent at 2pm 👇(LONDON time)' },
      { type: 'text', content: 'You need to respond as fast as you can with your answers!' },
      { type: 'text', content: '30 minutes later we announce the winner! 😍' },
      { type: 'text', content: 'If you want to write to the Langroo team anytime just write your message + #team 😉' },
    ],
    introFinal: [
      { type: 'text', content: 'Best of luck!! 👍' },
      { type: 'text', content: 'Talk to you soon, and great to meet you!!' },
    ],
    jumpToTutorFlow: [
      { type: 'text', content: 'Now, since you requested it...' },
      { type: 'quickReplies',
        content: {
          title: 'Are you ready to give me some more details for your tutor request? 👩',
          buttons: [
            { title: 'Sure', value: 'jump_from_intro_to_tutor' },
            { title: 'No', value: 'keep_going_with_intro_flow' },
          ],
        },
      },
    ],
    introPostFinal: [
      { type: 'text', content: `Very well ${senderName}, see you soon for the Daily Quiz!` },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

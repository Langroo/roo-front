const replyChooser = (replyName, senderName) => {

  const replies = {
    willDoTutorLater: [
      { type: 'text', content: 'Ok :(... BUT! I\'ll keep sharing my knowledge and talking to you 😊. If you change your mind 💡, just write \'I want a tutor\'.' },
    ],
    forgetfulnessDialog: [
      { type: 'text', content: `I'm sorry ${senderName} 😖, I'm embarrassed to say this but I forgot where we were in our conversation! 😵` },
      {
        type: 'quickReplies',
        content: {
          title: '🙏 Would you forgive me and allow me to start the conversation with an English native tutor from the beginning? 🌟',
          buttons: [
            { title: 'Yes, I forgive you', value: 'TF_YES_INIT' },
            { title: 'No, later', value: 'I will speak with a tutor later Roo, not now' },
          ],
        },
      },
    ],
    askUserToContinue: [
      { type: 'text', content: `Hey ${senderName}! Don't miss the opportunity to speak with a native tutor today! :o :D` },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you want to continue giving your details? :D',
          buttons: [
            { title: 'Yes, continue', value: 'continue_tutor_conversation' },
            { title: 'No, later', value: 'I will speak with a tutor later Roo, not now' },
          ],
        },
      },
    ],
    confirmSpeakToTutor: [
      {
        type: 'quickReplies',
        content: {
          title: '😜 Would you like to speak to an English native tutor? 👥 ',
          buttons: [
            { title: 'Yes', value: 'initiatePreTutorFlow' },
            { title: 'No', value: 'I will speak with a tutor later Roo, not now' },
          ],
        },
      },
    ],
    oldRegisterMessages: [
      { type: 'text', content: `Hold on ${senderName} ✋! You're too quick 😮, I'll let you use that option 📲 once we are finished here 👍.` },
      { type: 'text', content: 'Woah, before I can let you use that option, I need you to tell me a few things first 😁☝' },
    ],
    mustRegisterFirst: [
      { type: 'text', content: `Ok great ${senderName} 👍 Let me finish with some questions first and we can organise a tutor for you! 👨👌` },
    ],
    startingTutorFlow: [
      { type: 'text', content: `${senderName}! I can't believe how big you are now 😭, I'm so proud of you!!! 🙏` },
      { type: 'image', content: 'https://media.giphy.com/media/GcSqyYa2aF8dy/giphy.gif' },
      { type: 'text', content: 'We will try to get you a 15 minute trial call in the next 24 hours ⏳😍' },
      { type: 'quickReplies',
        content: {
          title: 'I want to find THE best tutor on my team for you, so let me ask you some questions about what you want… 😊',
          buttons: [{ title: 'Ok Thanks!', value: 'User clicks on thanks button on tutor flow' }],
        },
      },
    ],
    tutorAskCountryOfUser: [
      { type: 'image', content: 'https://media.giphy.com/media/l378afApZWr0IyIZq/giphy.gif' },
      { type: 'text', content: '1. In which country do you live now📍🗺🏡?' },
    ],
    describeYourself: [
      { type: 'image', content: 'https://media.giphy.com/media/HzMfJIkTZgx8s/giphy.gif' },
      { type: 'text', content: 'Nice!😎👍' },
      {
        type: 'text',
        content: '2. How would you describe yourself?😃😜(Please write enough keywords in just one paragraph🙇‍)',
      },
    ],
    describeYourInterests: [
      { type: 'image', content: 'https://media.giphy.com/media/l41lUjUgLLwWrz20w/giphy.gif' },
      {
        type: 'text',
        content: '3. What are your interests?❤👍😊(Again, please write enough keywords in just one paragraph🙇‍)',
      },
    ],
    whenToCallTutor: [
      { type: 'image', content: 'https://media.giphy.com/media/uDZexRVCffGww/giphy.gif' },
      {
        type: 'quickReplies',
        content:
        {
          title: '4. When can you do the calls📱 with your tutor💁‍🍎?',
          buttons:
          [
                { title: 'Morning(s)🌞', value: 'TFB_MORNING' },
                { title: 'Afternoon(s)🌤', value: 'TFB_AFTERNOON' },
                { title: 'Evening(s)🌛', value: 'TFB_EVENING' },
          ],
        },
      },
    ],
    confirmWhenToCallTutor: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Copied📝. Just to make sure😳, was there another time you also wanted to add⌚🤓😊?',
          buttons:
          [
                { title: 'Yes!!!😁', value: 'TFB_YES_ADD' },
                { title: 'No😌', value: 'TFB_NO_ADD' },
          ],
        },
      },
    ],
    whenToCallTutor2: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Awesome!☺ Which was the other time⌚?',
          buttons:
          [
                { title: 'Morning(s)🌞', value: 'TFB_MORNING_ALT' },
                { title: 'Afternoon(s)🌤', value: 'TFB_AFTERNOON_ALT' },
                { title: 'Evening(s)🌛', value: 'TFB_EVENING_ALT' },
          ],
        },
      },
    ],
    daysGroupForCalls: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Cool!😎 Which days?📆',
          buttons:
          [
                { title: 'Weekdays 🏫📚', value: 'tfb_weekdays' },
                { title: 'Weekends 🏡💆‍', value: 'tfb_weekends' },
          ],
        },
      },
    ],
    internetSpeedDescription: [
      {
        type: 'quickReplies',
        content:
        {
          title: `5. What is your internet connection like ${senderName}? 💻`,
          buttons:
          [
                { title: 'Really Bad 😱', value: 'Really_Bad_Internet' },
                { title: 'Bad 😦', value: 'Bad_Internet' },
                { title: 'Ok 😑', value: 'Ok_Internet' },
                { title: 'Good 👍', value: 'Good_Internet' },
                { title: 'Great 👌', value: 'Great_Internet' },
          ],
        },
      },
    ],
    knowThePrice: [
      { type: 'text', content: '6. Thanks for the information! ;) Just to make sure you know how much our costs are for tutors, can you look below and tell me if these prices are ok for you?' },
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/pricing.png' },
      {
        type: 'quickReplies',
        content:
        {
          title: `Please select an option below when you are ready ${senderName} 😀`,
          buttons:
          [
                { title: 'Prices Are Ok 👍', value: 'user_can_pay' },
              { title: 'I Don’t Have Money 😭', value: 'user_cannot_pay' },
          ],
        },
      },
    ],
    userCanPayForTutor: [
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/man-dialing-smartphone-suit.gif' },
      { type: 'text', content: 'Awesome 👏! I am going to ring your tutor now!📲' },
      { type: 'text', content: 'Here are the next steps:\n☑️We will select a tutor for you in 24 hours\n☑️They will add you on Facebook\n☑️You will organise a time for a 15 minute call\n☑️They will explain the classes to you\n☑️They will add you on Facebook\n☑️You can pay for classes with that tutor by writing UPGRADE PLAN here any paying using a debit card subscription' },
    ],
    userHasNoMoney: [
      { type: 'text', content: `I understand ${senderName}, 👍 you can still continue to learn with me.` },
    ],
    tutorFlowFinished: [
      { type: 'text', content: `I'm sorry ${senderName}, you already have requested a tutor. If you have any questions, you can use the hashtag #AskRoo to make them or just write HELP`},
      { type: 'text', content: `${senderName}, I already have a tutor requested for you. Write HELP if you need something else.`},
    ],
  }

  return replies[replyName]
}
module.exports = replyChooser

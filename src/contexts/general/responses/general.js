const replyChooser = (replyName, senderName, wildcard = {}) => {
  const fortuneQuotes = [
    'https://media.giphy.com/media/NfJo8DmOK8OIM/giphy.gif',
    'https://media.giphy.com/media/3oKIPn5Lc3oRd3kIBG/giphy.gif',
    'https://media.giphy.com/media/EOFKpFtAVluyA/giphy.gif',
    'https://media.giphy.com/media/IUrkSfzSCEhtm/giphy.gif',
    'https://media.giphy.com/media/xKG7zRvdV6JGw/giphy.gif',
    'https://media.giphy.com/media/8Xgb3nhHhH9fy/giphy.gif',
    'https://media.giphy.com/media/KJljgAgzVE73W/giphy.gif',
    'https://media.giphy.com/media/LlCcKEljlDaN2/giphy.gif',
    'https://media.giphy.com/media/uuG5L09Lwdco8/giphy.gif',
    'https://media.giphy.com/media/Bb3IuIHfH5pWE/giphy.gif',
    'https://media.giphy.com/media/xThuWoP3AwCNO3ShC8/giphy.gif',
    'https://media.giphy.com/media/aqxVIvZ9uqQuY/giphy.gif',
    'https://media.giphy.com/media/YKe6BoKsuM8Hm/giphy.gif',
    'https://media.giphy.com/media/XnU3mIWQXYQdW/giphy.gif',
    'https://media.giphy.com/media/PGjIdzErAsnK0/giphy.gif',
    'https://media.giphy.com/media/m5PkUt0azWFEc/giphy.gif',
    'https://media.giphy.com/media/ZhI2qfeN29CI8/giphy.gif',
    'https://media.giphy.com/media/Omw1BKGJV5pCw/giphy.gif',
    'https://media.giphy.com/media/V5Lz5ThZNZFgQ/giphy.gif',
  ]

  const replies = {
    askRoo: [
      { type: 'text', content: `Received ${senderName} 🔥 Look at our daily story during the next 3 days to see if my team select it :D :D` },
      { type: 'text', content: `💪 Amazing question ${senderName}! I am hoping that my team picks this one for the daily story in the next days.` },
      { type: 'text', content: '☝ I may not have all the answers, but I shall not rest until I find one for your question!\nCheck my daily story in the next 3 days to see if I found it' },
      { type: 'text', content: `${senderName}, I got it 👌! Sending this to my team and if they choose it, you will see it in the daily story.` },
      { type: 'text', content: 'This is what I like, a proactive student!\nCheck my daily story in the next days to see if your question was selected 👀' },
      { type: 'text', content: `A new candidate to be selected for the daily story! Thanks a lot ${senderName}, my hopes are on you 🙏` },
      { type: 'text', content: `The Langroo Team has received your message ${senderName} 📡.\nDon't miss my daily story in the next 3 days, your message may be among those selected!` },
    ],
    mustRegisterFirst: [
      { type: 'text', content: `Wait ${senderName}, you're too quick 🏇haha\nYou can access that option 📲 in a few minutes` },
      { type: 'text', content: 'I want to understand you more first 😉' },
    ],
    showPricing: [
      { type: 'text', content: `Here is my pricing ${senderName} 👐` },
      { type: 'image', content: 'https://s3.amazonaws.com/langroo/images/pricing.png' },
      { type: 'text', content: 'All you need to do is say "Upgrade to Tutor" to do so! ;)' },
    ],
    howToConverseMenu: [
      { type: 'text', content: '✨ To help you with our conversation, you can write these phrases down 👇:\n\nRESTART = Start our conversation again ⤴️\nCHANGE LEVEL = Change the level you are learning 😯\nCHANGE ACCENT = Change the accent you are learning 🇬🇧 🇺🇸\nTRANSLATE [phrase] into [language] = Translate a phrase into the language you want. For example “TRANSLATE how are you? into Spanish” 🔉\n#ASKROO = ask me and my team a question that we can answer in our daily story 💥\nSTOP = Stop receiving my messages ✋' },
    ],
    fortuneQuote: [
      { type: 'image', content: fortuneQuotes[Math.floor(Math.random() * fortuneQuotes.length)] },
    ],
    confirmUserReqHelp: [
      {
        type: 'quickReplies',
        content:
        {
          title: `Hey ${senderName}, is there something you want help with? 🙍✊`,
          buttons: [
              { title: 'Yes', value: 'yes_user_wants_help' },
              { title: 'Not right now', value: 'cancel_request' },
          ],
        },
      },
    ],
    userRequestsHelp: [
      { type: 'text', content: 'Sure thing, how can I help you? 🙌' },
    ],
    sendHelpRequestDetails: [
      { type: 'text', content: 'Ok, as you wish! 👍 I will contact one of my team members to look after it, and I\'ll get them to contact you! 😉' },
    ],
    confirmStopContent: [
      {
        type: 'quickReplies',
        content:
        {
          title: `Wait... What? 😱 Am I reading this right? Are you sure you want to stop talking to me ${senderName}? 😲 #devastated`,
          buttons: [
              { title: 'I\'m Joking', value: 'return_to_previous_flow' },
              { title: 'Talk to my Team', value: 'help' },
              { title: 'Yes, Stop Content', value: 'yes_stop_bot' },
          ],
        },
      },
    ],
    confirmStopContentAlt: [
      {
        type: 'quickReplies',
        content:
        {
          title: `Wait... What? 😱 Am I reading this right? Are you sure you want to stop talking to me ${senderName}? 😲 #devastated`,
          buttons: [
            { title: 'I\'m Joking', value: 'return_to_previous_flow' },
            { title: 'Talk to my Team', value: 'help' },
            { title: 'Yes, Stop Content', value: 'yes_stop_bot' },
          ],
        },
      },
    ],
    tooLateContentStopped: [
      { type: 'text', content: `No problem ${senderName}, thanks for being part of the learning journey with me! 🎓Can you give me one recommendation for how I can improve? 🙏👇`}
      // { type: 'text', content: `It's too late to say you're sorry now ${senderName}` },
      // { type: 'text', content: '💔' },
      // { type: 'text', content: `Ok, ${senderName}, you will no longer receive messages from me 😢🔇.` },
      // { type: 'text', content: 'Is there any particular reason 👐 so that I can improve for future learners? 📝' },
    ],
    wouldHearFutureOffers: [
      {
        type: 'text',
        content: 'Also, would you be interested in hearing about any future offers for learning with me? 😄',
      },
    ],
    thanksForFeedback: [
      { type: 'text', content: 'Ok, great thanks for the feedback, have a great day! :)' },
    ],
    sendRestartedContent: [
      { type: 'text', content: 'Ok 👌, I will start sending you content from the beginning as you requested. 😌' },
    ],
    restartOptions: [
      {
        type: 'button',
        content:
        {
          title: `Hey ${senderName}, are you sure you want to restart our conversation again 🔄? Or, is there another option you want 😮?`,
          buttons: [
              { title: 'Change Level/Accent', type: 'postback', value: 'change_level_or_accent' },
              { title: 'Other', type: 'postback', value: 'custom_user_req' },
              { title: 'Restart', type: 'postback', value: 'full_restart' },
          ],
        },
      },
    ],
    confirmRestartOfContent: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Ow, are you sure? 👀 Do you want to receive all the content again from day 1? 😯😅',
          buttons: [
              { title: 'Yes', value: 'yes_restart_content' },
              { title: 'No', value: 'no_restart_content' },
          ],
        },
      },
    ],
    chooseNewLevel: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Very well, to which level would you like to change?',
          buttons: [
              { title: 'Beginner', value: 'change_lvl_to_beg' },
              { title: 'Intermediate', value: 'change_lvl_to_int' },
              { title: 'Advanced', value: 'change_lvl_to_adv' },
          ],
        },
      },
    ],
    chooseNewAccent: [
      {
        type: 'quickReplies',
        content:
        {
          title: 'Very well, to which accent would you like to change?',
          buttons: [
              { title: 'United Kingdom (UK)', value: 'change_accent_to_uk' },
              { title: 'United States (US)', value: 'change_accent_to_us' },
          ],
        },
      },
    ],
    newLevelConfirmation: [
      {
        type: 'text',
        content: `Okey dokey ${senderName}, starting from next week I'll send you content for ${wildcard.newLevel} speakers  :D`,
      },
    ],
    newAccentConfirmation: [
      { type: 'text', content: `Okey dokey ${senderName}, starting from next week I'll send you content based on the ${wildcard.newAccent} accent  :D` },
    ],
    customUserRequest: [
      { type: 'text', content: 'Cool 👌, would you like to give me some details 📝 and I will respond as soon as I can?' },
    ],
    sendCustomUserRequest: [
      { type: 'text', content: `Great! ${senderName}, I'll let my bosses know and get back with an answer as soon as possible.` },
    ],
    chooseWhatToChange: [
      {
        type: 'button',
        content:
        {
          title: 'Which option would you like to change?',
          buttons: [
              { title: 'My Level', type: 'postback', value: 'level_change_req' },
              { title: 'My Accent', type: 'postback', value: 'accent_change_req' },
          ],
        },
      },
    ],
    confirmDeleteAccRequest: [
      { type: 'quickReplies',
        content: {
          title: '😮 Would you like to delete your account ❌ with me⁉',
          buttons: [
            { title: 'Yes', value: 'yes_start_deleting_account' },
            { title: 'No', value: 'no_do_not_delete_account' },
          ],
        },
      },
    ],
    userDeleteAccSecondStep: [
      { type: 'button',
        content: {
          title: 'Are you absolutely sure? Once you delete your account 📉, you will lose your subscription and you will have to start over. ♻',
          buttons: [
            { title: 'No, Keep It', type: 'postback', value: 'no_do_not_delete_account' },
            { title: 'Yes, Delete It', type: 'postback', value: 'yes_confirm_account_deletion' },
          ],
        },
      },
    ],
    accountDeletedMsg: [
      { type: 'text', content: `Well ${senderName}, it is hard for me to say goodbye. But if you choose to come back later, I will always be here for you ;)` },
    ],
    returningMessages: [
      [{ type: 'text', content: 'So 😀, as I was saying... ' }],
      [{ type: 'text', content: 'I know we got lost in conversation 😆, but...' }],
      [{ type: 'text', content: 'What did I ask you again? 😶Ow yeah ☝️ ...' }],
      [{ type: 'text', content: `I was waiting for you to respond the below ${senderName} 😁👇` }],
    ],
    sameLevelOrAccentReply: [
      {
        type: 'button',
        content:
        {
          title: `${senderName}‼ 😯️ You are already ${wildcard.currentLevel}! 😄 Let me give you some options again:`,
          buttons: [
              { title: 'Change Level/Accent', type: 'postback', value: 'change_level_or_accent' },
              { title: 'Other', type: 'postback', value: 'custom_user_req' },
              { title: 'Restart', type: 'postback', value: 'full_restart' },
          ],
        },
      },
    ],
    broadcastRestart: [
      { type: 'text', content: `Brilliant ${senderName}, get ready for takeoff! 🚀But, just before I ask some questions first…. 😉` },
    ],
    broadcastStartLater: [
      { type: 'text', content: `${senderName}, what is more important than learning to speak native English? Do you have a hot date or something? 💕 🍴 😂` },
      { type: 'text', content: 'No problem haha, 😀 when you are ready to start, tell me this' },
      { type: 'text', content: 'No problem haha, 😀 just write NEXT PHRASE when you want to continue!' },
    ],
    broadcastShare: [
      { type: 'text', content: `Super! 👏Send this link to your friend ${senderName} www.m.me/langroo` },
    ],
  }

  return replies[replyName]
}

module.exports = replyChooser

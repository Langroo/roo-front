const replyChooser = (replyName, senderName) => {

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
    helpUser_Init: [
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
    helpUser1: [
      { type: 'text', content: 'Sure thing, how can I help you? 🙌' },
    ],
    helpUser_Final: [
      { type: 'text', content: 'Ok, as you wish! 👍 I will contact one of my team members to look after it, and I\'ll get them to contact you! 😉' },
    ],
    initStopBotMessages: [
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
    stopBotMessages1: [
      { type: 'text', content: `No problem ${senderName}, thanks for being part of the learning journey with me! 🎓Can you give me one recommendation for how I can improve? 🙏👇` },
    ],
    stopBotMessages2: [
      { type: 'text', content: 'Also, would you be interested in hearing about any future offers for learning with me? 😄' },
    ],
    thanksForFeedback: [
      { type: 'text', content: 'Ok, great thanks for the feedback, have a great day! :)' },
    ],
    customUserRequest: [
      { type: 'text', content: 'Cool 👌, would you like to give me some details 📝 and I will respond as soon as I can?' },
    ],
    sendCustomUserRequest: [
      { type: 'text', content: `Great! ${senderName}, I'll let my bosses know and get back with an answer as soon as possible.` },
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
    broadcastShare: [
      { type: 'text', content: `Super! 👏Send this link to your friend ${senderName} www.m.me/langroo` },
    ],
    generalShareDialog: [
      { type: 'text', content: 'Super! 👏' },
      { type: 'text', content: 'Click "Share with Friend ❤️️" below and your friends will get sent this 👇' },
      { type: 'card',
        content: [
          {
            title: 'Hey! I\'m Participating in the Langroo Daily quiz!',
            subtitle: 'Do you want to improve your English with me? 😜',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/roo_logo_plane.png',
            buttons: [
              { title: 'Accept Invite! 📱', type: 'web_url', url: 'https://m.me/langroo' },
              { title: 'Share with Friend ❤️️', type: 'element_share' },
            ],
          },
        ],
      },
    ],
  }

  return replies[replyName]
}

module.exports = replyChooser

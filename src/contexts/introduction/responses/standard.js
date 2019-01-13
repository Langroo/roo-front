const replyChooser = (replyName, senderName, choice = 'this') => {
  // -- Required imports
  const { OneForAll } = require('../../../bot-tools');
  // -- Instantiation of classes
  const controllerSmash = new OneForAll();

  // -- Dialogs
  const randomResponses = [
    { type: 'text', content: 'So 😀, as I was saying... ' },
    { type: 'text', content: 'I know we got lost in conversation 😆, but...' },
    { type: 'text', content: 'What did I ask you again? 😶Ow yeah ☝️ ...' },
    { type: 'text', content: `I was waiting for you to respond below ${senderName} 😁👇` },
    { type: 'text', content: 'Retaking the subject:' },
  ];

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
    _userChoosesLanguage: [
      { type: 'text', content: '👌👌' },
      {
        type: 'quickReplies',
        content: {
          title: 'What language do you want to speak in?',
          buttons: [
            { title: 'Japanese', value: 'speak_japanese' },
            { title: 'English', value: 'speak_english' },
          ],
        },
      },
    ],
    _userIsNewOrInvited: [
      { type: 'text', content: '😀😀' },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you have an invite to learn with a friend or are you just starting? ',
          buttons: [
            { title: 'I have an Invite 🎫', value: 'user_has_invite' },
            { title: 'I’m new ☝️', value: 'user_is_new' },
          ],
        },
      },
    ],
    _userHasInvite: [
      { type: 'text', content: `So excited for you ${senderName}!` },
      { type: 'text', content: 'Who is going to win between you and your friend? 🏆 Let’s see!! 😜' },
      { type: 'image', content: 'https://media1.tenor.com/images/81690b56e4935f929a0b3d68ec6b279a/tenor.gif?itemid=7887388' },
      { type: 'text', content: 'I’m Roo, a chatbot whose mission is to help you and your friend master English! 😉' },
      { type: 'text', content: 'What is YOUR biggest motivation to improve your English?' },
    ],
    _hardestThing: [
      { type: 'text', content: 'Hmm.. interesting 👏' },
      { type: 'text', content: 'Well for me, three of the hardest things 😱 learning a language are:' },
      { type: 'text', content: '👉 Motivation' },
      { type: 'text', content: '👉 Learning structure' },
      { type: 'text', content: '👉 Flexibility and fun' },
      {
        type: 'quickReplies',
        content: {
          title: 'To continue with your details 🚀….. did you already have your free trial call with a tutor OR are you awaiting it?',
          buttons: [
            { title: 'Already had call 💻✅', value: 'already_had_a_call' },
            { title: 'Awaiting our first call ⏰☝️', value: 'awaiting_our_first_call' },
          ],
        },
      },
    ],
    _hardestThingNewUser: [
      { type: 'text', content: '👍👍' },
      { type: 'text', content: `Well, to get you started ${senderName}, three of the hardest things about learning a language are:` },
      { type: 'text', content: '👉 Motivation' },
      { type: 'text', content: '👉 Learning structure' },
      { type: 'text', content: '👉 Flexibility and fun' },
      { type: 'text', content: 'And that’s what I am solving!💥' },
      { type: 'text', content: 'I will introduce you to tutors and you can choose to learn with them by yourself or with a friend – if you’re up for the challenge! 🏆😜' },
      { type: 'text', content: 'Are you ready to get started....?' },
    ],
    _explainABitToUser: [
      { type: 'text', content: 'Ok, let me explain a bit more! ' },
      { type: 'text', content: '👐 1. I will send you a list of English tutors from around the world' },
      { type: 'text', content: '👐 2. You can choose and add the tutor you like on Facebook ' },
      { type: 'text', content: '👐 3. You will have a free 15 minute call online via Messenger' },
      { type: 'text', content: '👐 4. If you like the tutor, you can sign-up to have weekly video classes again through Facebook!' },
      {
        type: 'quickReplies',
        content: {
          title: `Do you want to proceed with a free trial ${senderName}? 😃`,
          buttons: [
            { title: 'Sure, let’s do it!', value: 'proceed_with_trial' },
            { title: 'Maybe', value: 'proceed_with_trial' },
            { title: 'No, thanks', value: 'dont_proceed_with_trial' },
          ],
        },
      },
    ],
    _wontProceedWithFreeTrial: [
      { type: 'text', content: `Sure, no problem ${senderName}, would you like to tell me why?` },
    ],
    _introFinalNoFreeTrial: [
      { type: 'text', content: 'If your circumstances change, we’re always here for you! 🙌 ' },
    ],
    _willProceedWithFreeTrial: [
      {
        type: 'quickReplies',
        content: {
          title: 'Ok, awesome, will you be learning with a friend or by yourself?',
          buttons: [
            { title: 'By myself ✌️', value: 'proceed_with_trial_by_myself' },
            { title: 'With a friend 👨👩', value: 'proceed_with_trial_with_a_friend' },
          ],
        },
      },
    ],
    _freeTrialAlone: [
      { type: 'text', content: `I am going to present you with our finest tutors ${senderName}. All you have to do now is:` },
      { type: 'text', content: '👐 1. Add the one you prefer directly on Facebook' },
      { type: 'text', content: '👐 2. Say hello via Messenger' },
      { type: 'text', content: '👐 3. Organise your free 15 minute call' },
      { type: 'text', content: 'Start below:' },
      {
        type: 'carousel',
        content: [
          {
            title: '"Abby from Plymouth, UK"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_1.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/abby.crawford',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
          {
            title: '"Tanner from Wisconsin, USA"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_man_tutor_1.jpg',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/tannerlt',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
          {
            title: '"Joanne from London, UK"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_2.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/joannewood',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
        ],
      },
      { type: 'delay', content: 30000 },
      { type: 'text', content: '👐 4. After your free class, once you’re happy you can start weekly classes by saying PAY NOW' },
    ],
    _freeTrialWithFriend: [
      { type: 'text', content: `Let the games begin ${senderName}!!` },
      { type: 'text', content: 'Start by nominating your friend below:' },
      {
        type: 'card',
        content: [
          {
            title: 'Hey! Do you want to start doing an English class together?',
            subtitle: 'With Langroo you can chat with an English tutor & it’s half/price with 2 people!',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/friend-invite-roo.jpeg',
            buttons: [
              { title: 'Invite 📩', type: 'element_share' },
              { title: 'Accept Friend’s Invite 👍', type: 'web_url', url: 'https://m.me/langroo' },
            ],
          },
        ],
      },
      { type: 'delay', content: 10000 },
      { type: 'text', content: 'Once you have invited your friend, it’s time to choose your tutor! Look at the different profiles, and whoever you think is the coolest for you and your friend:' },
      { type: 'text', content: '👐 1. Add them directly on Facebook' },
      { type: 'text', content: '👐 2. Say hello via messenger and invite your friend to the conversation' },
      { type: 'text', content: '👐 3. Organise a three-way free 15 minute call' },
      { type: 'text', content: 'Continue below:' },
      {
        type: 'carousel',
        content: [
          {
            title: '"Abby from Plymouth, UK"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_1.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/abby.crawford',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
          {
            title: '"Tanner from Wisconsin, USA"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_man_tutor_1.jpg',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/tannerlt',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
          {
            title: '"Joanne from London, UK"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_2.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://about.me/joannewood',
                title: 'FREE Call! 💻',
              },
              {
                type: 'postback',
                title: 'Help ❓',
                value: 'help',
              },
            ],
          },
        ],
      },
      { type: 'delay', content: 30000 },
      { type: 'text', content: '👐 4. After your free class, once you’re happy you can sign-up to weekly classes by saying PAY WITH FRIEND' },
    ],
    _alreadyHadACall: [
      { type: 'text', content: 'Awesome, the next step for you is to choose your subscription plan! :)' },
      { type: 'image', content: 'https://www.google.com/url?q=https://i.imgur.com/jMMjoLj.png' },
      { type: 'text', content: 'Please write PAY WITH FRIEND, to pay now 💳:' },
    ],
    _awaitingOurFirstCall: [
      { type: 'text', content: `Great ${senderName}, so here are the next steps:` },
      { type: 'text', content: '👐 1. Your friend chooses the tutor' },
      { type: 'text', content: '👐 2. Your friend will send you a three-way message with the tutor' },
      { type: 'text', content: '👐 3. You will have a free 15 minute call together' },
      { type: 'text', content: '👐 4. When you are ready to choose a subscription, come back here and write PAY WITH FRIEND' },
      { type: 'text', content: 'If you have any problems write HELP' },
    ],
    _newUser: [
      { type: 'text', content: `So ${senderName}, let me introduce myself` },
      { type: 'text', content: 'I’m Roo, a chatbot whose mission is to help you master English! 😉' },
      { type: 'text', content: 'Tell me a bit about yourself? 😜' },
    ],
    introFinal: [
      { type: 'text', content: 'Best of luck!! 👍' },
      { type: 'text', content: 'Talk to you soon, and great to meet you!!' },
    ],
    jumpToTutorFlow: [
      { type: 'text', content: 'Now, since you requested it...' },
      {
        type: 'quickReplies',
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
  };
  return replies[replyName];
};
module.exports = replyChooser;

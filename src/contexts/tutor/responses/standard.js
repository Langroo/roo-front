const replyChooser = (replyName, senderName) => {
  const replies = {
    exploreTutorFlow: [
      { type: 'text', content: `Hey ${senderName}, how are you? Just to tell you, I have amazing connections to native English tutors in the UK and the US! 🇬🇧 🇺🇸` },
      { type: 'text', content: 'But before you explore them 🔎, let me ask a couple of questions!' },
      {
        type: 'quickReplies',
        content: {
          title: '(½) Our tutor calls happen via Messenger video, how strong is your internet connection? 📶',
          buttons: [
            { title: 'Really Bad 😱', value: 'tutor_answer_connection_really_bad' },
            { title: 'Bad 😦', value: 'tutor_answer_connection_bad' },
            { title: 'Ok 😑', value: 'tutor_answer_connection_ok' },
            { title: 'Good 👍', value: 'tutor_answer_connection_good' },
            { title: 'Great 👌', value: 'tutor_answer_connection_great' },
          ],
        },
      },
    ],
    badConnection: [
      { type: 'text', content: `Ah.. ok, sorry to hear ${senderName} 😪 From our experience, it won’t work unless your internet is strong! If your situation changes try again! 💪` },
    ],
    goodConnection: [
      { type: 'text', content: 'Good!' },
      { type: 'text', content: `(2/2) Quality comes at a price ${senderName} We have a 95%+ success rate on our tutor classes! 🏆` },
      { type: 'image', content: 'https://i.imgur.com/kyJADuZ.png' },
      {
        type: 'quickReplies',
        content: {
          title: 'Are our prices ok for you?',
          buttons: [
            { title: 'Prices Are Ok 👍', value: 'tutor_answer_user_can_pay' },
            { title: 'I Can’t 😰', value: 'tutor_answer_prices_user_cannot_pay' },
          ],
        },
      },
    ],
    userCannotPay: [
      { type: 'text', content: `I understand ${senderName}, we will try to continue giving you as much value as possible! 🎁` },
    ],
    userCanPay: [
      { type: 'text', content: 'Super!' },
      {
        type: 'quickReplies',
        content: {
          title: 'And do you have a preference for male or female tutors? 📝',
          buttons: [
            { title: 'Male 👨', value: 'tutor_answer_male_tutor' },
            { title: 'Female 👩', value: 'tutor_answer_female_tutor' },
            { title: 'Either 😀', value: 'tutor_answer_either_tutor' },
          ],
        },
      },
    ],
    eitherTutor: [
      { type: 'text', content: 'Ok! 💥' },
      { type: 'text', content: 'You can choose to have a FREE introduction call with the tutor you like the most! Select an option below' },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Plymouth"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_1.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
          {
            title: '"I\'m from Wisconsin"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_man_tutor_1.jpg',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
          {
            title: '"I\'m from London"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_2.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
        ],
      },
      { type: 'text', content: 'If you schedule a call, you can pay after 💳 by using the option in the menu!' },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you have any questions? ❓',
          buttons: [
            { title: 'Yes', value: 'tutor_answer_have_question' },
            { title: 'No', value: 'tutor_answer_have_not_question' },
          ],
        },
      },
    ],
    maleTutor: [
      { type: 'text', content: 'Ok! 💥' },
      { type: 'text', content: 'You can choose to have a FREE introduction call with the tutor you like the most! Select an option below' },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Wisconsin"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_man_tutor_1.jpg',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
        ],
      },
      { type: 'text', content: 'If you schedule a call, you can pay after 💳 by using the option in the menu!' },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you have any questions? ❓',
          buttons: [
            { title: 'Yes', value: 'tutor_answer_have_question' },
            { title: 'No', value: 'tutor_answer_have_not_question' },
          ],
        },
      },
    ],
    femaleTutor: [
      { type: 'text', content: 'Ok! 💥' },
      { type: 'text', content: 'You can choose to have a FREE introduction call with the tutor you like the most! Select an option below' },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Plymouth"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_1.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
          {
            title: '"I\'m from London"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo_of_woman_tutor_2.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.langroo.com/',
                title: 'Schedule Free Call!',
              },
            ],
          },
        ],
      },
      { type: 'text', content: 'If you schedule a call, you can pay after 💳 by using the option in the menu!' },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you have any questions? ❓',
          buttons: [
            { title: 'Yes', value: 'tutor_answer_have_question' },
            { title: 'No', value: 'tutor_answer_have_not_question' },
          ],
        },
      },
    ],
    haveQuestion: [
      { type: 'text', content: 'If you have any questions, please write #help + your question and a member of my team can answer! 🙋:)' },
    ],
    haveNotQuestion: [
      { type: 'text', content: 'Ok great 👍, enjoy!' },
    ],
  }

  return replies[replyName]
}
module.exports = replyChooser

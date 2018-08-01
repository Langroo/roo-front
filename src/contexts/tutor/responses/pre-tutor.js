const replyChooser = (replyName, senderName, aux = { accent: 'US', motivation: 'your vocabulary, pronunciation and specific knowledge in english', remindTime: 'next week' }) => {

  const replies = {

    retakePreTutorFromReminder: [
      { type: 'text', content: `Of course ${senderName}! These are the benefits 🎁 that students like you are getting by having calls with a personal tutor:` },
      { type: 'text', content: `✅ Weekly English practice\n✅ Get corrected quickly\n✅ Interesting conversations on ${aux.accent} culture\n✅ Information on slang in the ${aux.accent}\n✅ Extra help related to ${aux.motivation}` },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you want a 15 minute free trial?',
          buttons: [
            { title: 'Yes please 👍', value: 'tf_yes_init' },
            { title: 'Ask Next Week 👉', value: 'pre_tutor_answer_next_week' },
            { title: 'Ask Next Month 👉', value: 'pre_tutor_answer_next_month' },
            { title: 'No,thanks 👎', value: 'pre_tutor_answer_never' },
          ],
        },
      },
    ],

    initiateUpsellingFlow: [
      { type: 'text', content: `Hey ${senderName}, how are you? Just to tell you, I have amazing connections to native English tutors in the UK and the US! 🇬🇧 🇺🇸` },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Los Angeles"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/women-s-white-and-black-button-up-collared-shirt.jpeg',
          },
          {
            title: '"I\'m from London"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo-of-a-man-listening-music-on-his-phone.jpeg',
          },
          {
            title: '"I\'m from Michigan"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/man-young-happy-smiling.jpeg',
          },
          {
            title: '"I\'m from Oxford"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/closeup-photo-of-woman-with-brown-coat-and-gray-top.jpeg',
          },
        ],
      },
      { type: 'text', content: `They can specifically help you with ${aux.motivation}. 🙌` },
      {
        type: 'quickReplies',
        content: {
          title: 'Would you like to hear more? 📢 ',
          buttons: [
            { title: 'Tell me Now 👍', value: 'pre_tutor_answer_tell_me_now' },
            { title: 'Next Week 👉', value: 'pre_tutor_answer_next_week' },
            { title: 'Next Month 👉', value: 'pre_tutor_answer_next_month' },
            { title: 'Never 👎', value: 'pre_tutor_answer_never' },
          ],
        },
      },
    ],

    fromIntroPreTutorFlow: [
      { type: 'text', content: `So, ${senderName}, since you requested it, I will tell you! 😃` },
      { type: 'text', content: 'I have amazing connections to native English tutors in the UK and the US! 🇬🇧 🇺🇸' },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Los Angeles"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/women-s-white-and-black-button-up-collared-shirt.jpeg',
          },
          {
            title: '"I\'m from London"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo-of-a-man-listening-music-on-his-phone.jpeg',
          },
          {
            title: '"I\'m from Michigan"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/man-young-happy-smiling.jpeg',
          },
          {
            title: '"I\'m from Oxford"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/closeup-photo-of-woman-with-brown-coat-and-gray-top.jpeg',
          },
        ],
      },
      { type: 'text', content: `They can specifically help you with ${aux.motivation}. 🙌` },
      {
        type: 'quickReplies',
        content: {
          title: 'Would you like to hear more? 📢 ',
          buttons: [
            { title: 'Tell me Now 👍', value: 'pre_tutor_answer_tell_me_now' },
            { title: 'Next Week 👉', value: 'pre_tutor_answer_next_week' },
            { title: 'Next Month 👉', value: 'pre_tutor_answer_next_month' },
            { title: 'Never 👎', value: 'pre_tutor_answer_never' },
          ],
        },
      },
    ],

    initiatePreTutorFlow: [
      { type: 'text', content: `So, ${senderName}, happy you selected that option! 😃` },
      { type: 'text', content: 'I have amazing connections to native English tutors in the UK and the US! 🇬🇧 🇺🇸' },
      {
        type: 'carousel',
        content: [
          {
            title: '"I\'m from Los Angeles"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/women-s-white-and-black-button-up-collared-shirt.jpeg',
          },
          {
            title: '"I\'m from London"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/photo-of-a-man-listening-music-on-his-phone.jpeg',
          },
          {
            title: '"I\'m from Michigan"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/man-young-happy-smiling.jpeg',
          },
          {
            title: '"I\'m from Oxford"',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/closeup-photo-of-woman-with-brown-coat-and-gray-top.jpeg',
          },
        ],
      },
      { type: 'text', content: `They can specifically help you with ${aux.motivation}. 🙌` },
      {
        type: 'quickReplies',
        content: {
          title: 'Would you like to hear more? 📢 ',
          buttons: [
            { title: 'Tell me Now 👍', value: 'pre_tutor_answer_tell_me_now' },
            { title: 'Next Week 👉', value: 'pre_tutor_answer_next_week' },
            { title: 'Next Month 👉', value: 'pre_tutor_answer_next_month' },
            { title: 'Never 👎', value: 'pre_tutor_answer_never' },
          ],
        },
      },
    ],
    PTnextWeekOrMonth: [
      { type: 'text', content: `No problem ${senderName}, I will ask you again ${aux.remindTime}! ;) 👌` },
    ],
    PTneverRemindUser: [
      { type: 'text', content: 'No problem! :) You can continue learning with me for free! },
    ],
    PTtellUserNow: [
      { type: 'text', content: `Of course ${senderName}! These are the benefits 🎁 that students like you are getting by having calls with a personal tutor:` },
      { type: 'text', content: `✅ Weekly English practice\n✅ Get corrected quickly\n✅ Interesting conversations on ${aux.accent} culture\n✅ Information on slang in the ${aux.accent}\n✅ Extra help related to ${aux.motivation}` },
      {
        type: 'quickReplies',
        content: {
          title: 'Do you want a 15 minute free trial?',
          buttons: [
            { title: 'Yes please 👍', value: 'tf_yes_init' },
            { title: 'Ask Next Week 👉', value: 'pre_tutor_answer_next_week' },
            { title: 'Ask Next Month 👉', value: 'pre_tutor_answer_next_month' },
            { title: 'No,thanks 👎', value: 'pre_tutor_answer_never' },
          ],
        },
      },
    ],
  }

  return replies[replyName]
}
module.exports = replyChooser

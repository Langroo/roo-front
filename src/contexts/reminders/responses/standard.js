const replyChooser = (replyName, senderName, aux = {}) => {
  const replies = {
    pressBtnFirstReminder: [
      { type: 'text', content: `Hey ${senderName}, I need you to select a button below 👇:` },
    ],
    pressBtnSecondReminder: [
      { type: 'text', content: 'Haha, hey! I need you to click a button below 👇' },
    ],
    after5HoursReminder: [
      { type: 'text', content: `Hey ${senderName}, are you there? :) I'm here when you need me!` },
    ],
    tutorRequestReminder: [
      {
        type: 'quickReplies',
        content: {
          title: `Hey ${senderName}, you told me to remind you about tutors! Do you want to hear about the benefits again?`,
          buttons: [
            { title: 'Sure', value: 'go to benefits in tutor flow now' },
            { title: 'Not Now', value: 'pre_tutor_answer_next_week' },
          ],
        },
      },
    ],
    // if [not now], remind in [one week] again
    initiateUpsellingFlow: [
      { type: 'text', content: 'Hey, how are you? Just to tell you, I have amazing connections to native English tutors in the UK and the US! 🇬🇧 🇺🇸' },
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
  };

  return replies[replyName];
};
module.exports = replyChooser;

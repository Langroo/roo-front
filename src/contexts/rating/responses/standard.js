const replyChooser = (replyName, senderName) => {
  const replies = {
    pressButtonForRating: [
      {
        type: 'quickReplies',
        content: {
          title: `${senderName}, in order to give your rating of me, I need you to press the buttons below 👇`,
          buttons: [
            { title: '1', value: 'rating_response_1' },
            { title: '2', value: 'rating_response_2' },
            { title: '3', value: 'rating_response_3' },
            { title: '4', value: 'rating_response_4' },
            { title: '5', value: 'rating_response_5' },
            { title: '6', value: 'rating_response_6' },
            { title: '7', value: 'rating_response_7' },
            { title: '8', value: 'rating_response_8' },
            { title: '9', value: 'rating_response_9' },
            { title: '10', value: 'rating_response_10' },
          ],
        },
      },
    ],
  };

  return replies[replyName];
};
module.exports = replyChooser;

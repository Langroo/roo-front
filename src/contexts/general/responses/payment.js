const replyChooser = (replyName, senderName, url = {}) => {

  const menuOptions = (planURL) => {
    return [
      {
        type: 'web_url',
        url: url[planURL],
        title: 'Pay now!',
      },
      {
        type: 'postback',
        title: 'Payment Complete! ↩️',
        value: 'payment_complete_postback',
      },
      {
        type: 'postback',
        title: 'Help❓',
        value: 'help_paying_postback',
      },
    ]
  }

  const replies = {
    paymentDialog_Init: [
      {
        type: 'quickReplies',
        content:
        { title: 'Sure! In which currency would you like to see the prices? 💁',
          buttons: [
              { title: 'USD $', value: 'USD_currency' },
              { title: 'EURO €', value: 'EUR_currency' },
          ],
        },
      },
    ],
    paymentDialog1: [
      { type: 'text', content: `Here you go ${senderName}, click an  option below to pay!` },
      {
        type: 'carousel',
        content: [
          {
            title: 'Casual Plan!',
            imageUrl: 'https://s3.amazonaws.com/langroo/images/casual_plan_pricing.png',
            buttons: menuOptions('casualURL'),
          },
          {
            title: 'Ambitious Plan!',
            imageUrl: 'https://i.imgur.com/XiEt2WX.png',
            buttons: menuOptions('standardURL'),
          },
          {
            title: 'Elite Plan!',
            imageUrl: 'https://i.imgur.com/WtILnZS.png',
            buttons: menuOptions('eliteURL'),
          },
        ],
      },
    ],
    paymentHelpDialog: [
      { type: 'text', content: `If you have a question, write it below  ${senderName} with #help and our team will answer it as soon as we can! 🏃` },
    ],
    paymentDialog_Final: [
      { type: 'text', content: `Great ${senderName}, a member of our team will check your account 🔎, and contact your tutor to start the classes! 🎉🎉` },
      { type: 'text', content: 'If there is anything you can think of 💡to improve our experience 🚀, send a message here + #help and we will see it! 😀' },
    ],
  }

  return replies[replyName]
}
module.exports = replyChooser

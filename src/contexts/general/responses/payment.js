const replyChooser = (replyName, senderName, url = {}) => {

  const euroPrices = {
    casual: '€17',
    standard: '€32',
    elite: '€50',
  }
  const dollarPrices = {
    casual: '$20',
    standard: '$38',
    elite: '$57',
  }

  let messenger_extensions
  process.env.NODE_ENV === 'local' ? messenger_extensions = false : messenger_extensions = true

  let prices = {}
  url.currency === 'USD' ? prices = dollarPrices : prices = euroPrices

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
            title: `1 class per week, ${prices.casual}/weekly`,
            imageUrl: 'https://s3.amazonaws.com/langroo/images/tutor_image_1.png',
            subtitle: 'For starters, our most casual plan 👍',
            buttons: [
              {
                type: 'web_url',
                url: url.eliteURL,
                title: 'Pay in 10 seconds!',
                webview_height_ratio: 'tall',
                messenger_extensions,
                fallback_url: 'https://www.facebook.com/langroo',
              },
              {
                type: 'postback',
                title: 'Help Needed ❓',
                payload: 'help_paying_postback'
              },
              {
                type: 'postback',
                title: 'Payment Complete! ↩️',
                payload: 'payment_complete_postback'
              },
            ],
          },
          {
            title: `2 classes per week, ${prices.standard}/weekly`,
            imageUrl: 'https://s3.amazonaws.com/langroo/images/tutor_image_2.png',
            subtitle: 'Standard, for those with more time 😀',
            buttons: [
              {
                type: 'web_url',
                url: url.eliteURL,
                title: 'Pay in 10 seconds!',
                webview_height_ratio: 'tall',
                messenger_extensions,
                fallback_url: 'https://www.facebook.com/langroo',
              },
              {
                type: 'postback',
                title: 'Help Needed ❓',
                payload: 'help_paying_postback'
              },
              {
                type: 'postback',
                title: 'Payment Complete! ↩️',
                payload: 'payment_complete_postback'
              },
            ],
          },
          {
            title: `3 classes per week, ${prices.elite}/weekly`,
            imageUrl: 'https://s3.amazonaws.com/langroo/images/tutor_image_3.png',
            subtitle: 'SAVE 5%! For the fastest results! 💪',
            buttons: [
              {
                type: 'web_url',
                url: url.eliteURL,
                title: 'Pay in 10 seconds!',
                webview_height_ratio: 'tall',
                messenger_extensions,
                fallback_url: 'https://www.facebook.com/langroo',
              },
              {
                type: 'postback',
                title: 'Help Needed ❓',
                payload: 'help_paying_postback'
              },
              {
                type: 'postback',
                title: 'Payment Complete! ↩️',
                payload: 'payment_complete_postback'
              },
            ],
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

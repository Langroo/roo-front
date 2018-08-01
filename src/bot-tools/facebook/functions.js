const axios = require('axios')
const Raven = require('raven')
Raven.config('https://96d6795013a54f8f852719919378cc59@sentry.io/304046').install()

class FacebookAPI {
  constructor (senderId) {
    this.senderId = senderId
  }
  /**
   * Function that gets the user public profile if available
   * Fields that can be requested:
   * first_name
   * last_name
   * profile_pic
   * locale
   * timezone
   * gender
   * is_payment_enabled
   * last_ad_referral
   * Ex.: first_name,last_name,timezone
   * Error code is 2018218 :: No profile available for this user
   * */
  async GetUserPublicProfile (fields) {
    try {
      return (await axios.get(`${process.env.FB_BASE_URL}/${process.env.FB_VERSION}/${this.senderId}?fields=${fields}&access_token=${process.env.FB_ACCESS_TOKEN}`)).data
    } catch (error) {
      console.error('-> Error occurred requesting the user\'s public profile from Facebook ::\n', error.response.data)
      return false
    }
  }

  /**
  * Function that switches between the inbox app and the bot app
  * */
  async HandoverSwitch (state) {
    if (state === 0) {
      try {
        await axios.request({
          headers: { 'Content-Type': 'application/json' },
          url: `https://graph.facebook.com/${process.env.FB_VERSION}/me/pass_thread_control?access_token=${process.env.FB_ACCESS_TOKEN}`,
          method: 'post',
          data: `{"recipient":{"id":"${this.senderId}"},"target_app_id":263902037430900,"metadata":"Inbox enabled!"}`,
        })
        console.log('>>> Bot deactivated - User input redirected to inbox <<<')
      } catch (error) {
        console.error('An error occurred in the BotSwitch of Facebook ::\n', error.response.data)
      }
    } else {
      try {
        axios.request({
          headers: { 'Content-Type': 'application/json' },
          url: `https://graph.facebook.com/${process.env.FB_VERSION}/me/take_thread_control?access_token=${process.env.FB_ACCESS_TOKEN}`,
          method: 'post',
          data: `{"recipient":{"id":"${this.senderId}"},"metadata":"Bot Enabled!"}`,
        })
        console.log('>>> Bot has been reactivated <<<')
      } catch (error) {
        console.error('-> Error occurred in the BotSwitch of Facebook ::\n', error.response.data)
      }
    }
  }

  /**
  * Function to display balloon with waiting dots in messenger
  * */
  async TypingDots (state, senderId) {
    let typingState = 'typing_off'
    switch (state) {
    case 0:
      typingState = 'typing_off'
      break
    case 1:
      typingState = 'typing_on'
    }
    try {
      await axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: `https://graph.facebook.com/${process.env.FB_VERSION}/me/messages?access_token=${process.env.FB_ACCESS_TOKEN}`,
        method: 'post',
        data: `{"recipient":{"id":"${senderId}"},"sender_action":"${typingState}"}`,
      })
    } catch (error) {
      console.error('[!] TYPING DOTS ERROR ::\n', error.response.data)
    }
  }

  static async PersistentMenu () {

    try {
      await axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: `https://graph.facebook.com/${process.env.FB_VERSION}/me/messenger_profile?access_token=${process.env.FB_ACCESS_TOKEN}`,
        method: 'post',
        data: JSON.stringify({
          persistent_menu: [{
            locale: 'default',
            composer_input_disabled: false,
            call_to_actions: [
              { title: '❤ Share', type: 'postback', payload: 'share' },
              { title: '🙍 Explore Tutors', type: 'postback', payload: 'TALK_TO_TUTOR' },
              { title: '👉 More',
                type: 'nested',
                call_to_actions:
                [
                  { title: '🔐 Pay', type: 'postback', payload: 'subscribe me' },
                  { title: '🙋 Help', type: 'postback', payload: 'help' },
                  { title: '📵 Stop All Messages', type: 'postback', payload: 'FREEZE THE CURRENT FLOW' },
                ],
              },
            ],
          },
          ],
        }),
      })
      console.log('>>> Facebook\'s menu has been updated <<<')
      return 0
    } catch (error) {
      console.error('Error updating/creating the persistent menu in Facebook ::\n', error.response.data)
      return error
    }
  }

  async SendMessages (type, payload) {
    let preparedMessage

    if (type === 'carousel') {

      const carousel = []
      // NOTE: content_type supported by FB are text, location, phone number and email
      for (const cards of payload) {
        if (cards.buttons && cards.subtitle) {

          const buttonsOfCard = []
          for (const buttonTemplate of cards.buttons) {

            if (buttonTemplate.type === 'postback') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
                title: buttonTemplate.title,
                payload: buttonTemplate.value,
              })
            } else if (buttonTemplate.type === 'web_url') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
                title: buttonTemplate.title,
                url: buttonTemplate.url,
              })
            } else if (buttonTemplate.type === 'element_share') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
              })
            }

          }
          carousel.push({
            title: cards.title,
            image_url: cards.imageUrl,
            subtitle: cards.subtitle,
            buttons: buttonsOfCard,
          })

        } else if (cards.buttons) {

          const buttonsOfCard = []
          for (const buttonTemplate of cards.buttons) {

            if (buttonTemplate.type === 'postback') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
                title: buttonTemplate.title,
                payload: buttonTemplate.value,
              })

            } else if (buttonTemplate.type === 'web_url') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
                title: buttonTemplate.title,
                url: buttonTemplate.url,
              })

            } else if (buttonTemplate.type === 'element_share') {
              buttonsOfCard.push({
                type: buttonTemplate.type,
              })
            }

          }
          carousel.push({
            title: cards.title,
            image_url: cards.imageUrl,
            buttons: buttonsOfCard,
          })

        } else if (cards.subtitle) {

          carousel.push({
            title: cards.title,
            image_url: cards.imageUrl,
            subtitle: cards.subtitle,
          })

        } else {

          carousel.push({
            title: cards.title,
            image_url: cards.imageUrl,
          })

        }
      }

      // Set the prepared message
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: carousel,
            },
          },
        },
      })

    }

    if (type === 'button') {

      const buttonsArray = []
      // NOTE: content_type supported by FB are text, location, phone number and email
      for (const buttons of payload.buttons) {

        if (buttons.type === 'postback') {
          buttonsArray.push({
            type: buttons.type,
            title: buttons.title,
            payload: buttons.value,
          })
        } else if (buttons.type === 'web_url') {
          buttonsArray.push({
            type: buttons.type,
            title: buttons.title,
            url: buttons.url,
          })
        } else if (buttons.type === 'element_share') {
          buttonsArray.push({
            type: buttons.type,
          })
        }

      }

        // Set the prepared message
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: type,
              text: payload.title,
              buttons: buttonsArray,
            },
          },
        },
      })

    } else if (type === 'quickReplies') {
      const quickRepliesArray = []
      // NOTE: content_type supported by FB are text, location, phone number and email
      for (const buttons of payload.buttons) {
        if (buttons.image_url) {
          quickRepliesArray.push({
            content_type: 'text',
            title: buttons.title,
            payload: buttons.value,
            image_url: buttons.image_url,
          })
        } else {
          quickRepliesArray.push({
            content_type: 'text',
            title: buttons.title,
            payload: buttons.value,
          })
        }
      }

      // Set the prepared Message
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          text: payload.title,
          quick_replies: quickRepliesArray,
        },
      })
    } else if (type === 'text') {
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: { id: this.senderId },
        message: { text: payload },
      })
    } else if (type === 'audio') {
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type,
            payload: {
              url: payload,
              is_reusable: true,
            },
          },
        },
      })
    } else if (type === 'video') {
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type,
            payload: {
              url: payload,
              is_reusable: true,
            },
          },
        },
      })
    } else if (type === 'image') {
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type,
            payload: {
              url: payload,
              is_reusable: true,
            },
          },
        },
      })
    } else if (type === 'file') {
      preparedMessage = JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: this.senderId,
        },
        message: {
          attachment: {
            type,
            payload: {
              url: payload,
              is_reusable: true,
            },
          },
        },
      })
    }

    return await axios.request({
      headers: { 'Content-Type': 'application/json' },
      url: `${process.env.FB_BASE_URL}/${process.env.FB_VERSION}/me/messages?access_token=${process.env.FB_ACCESS_TOKEN}`,
      method: 'post',
      data: preparedMessage,
    })
      .catch(theError => console.error('Error Sending message to Facebook :: \n ', theError.response.data))
  }

}

module.exports = FacebookAPI
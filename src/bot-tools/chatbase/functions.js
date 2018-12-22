require('dotenv').config();

const axios = require('axios');

/*
 handled = false
 messageContent = 'hey chatbot!'
 messageId = "mid.1457764197618:41d102a3e1ae206a123"
 */

class chatbaseFunctions {
  async analyticReceived(messageContent, messageId, entityAndFlow, notHandled, version = '1.01') {
    try {
      const call = {
        headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
        url: `https://chatbase.com/api/facebook/message_received?api_key=${process.env.CHATBASE_REQUEST_TOKEN}`,
        method: 'post',
        data: `{
          "sender": {"id": "${process.env.SENDER_ID}"},
          "recipient": {"id": "${process.env.SENDER_ID}"},
          "timestamp": ${(new Date()).getTime()},
          "message": {
            "mid": "${messageId}",
            "text": "${messageContent}"
          },
          "chatbase_fields": {
            "intent": "${entityAndFlow}",
            "version": "${version}",
            "not_handled": ${notHandled}
          }
        }`,
      };
      return (await axios.request(call)).data;
    } catch (reason) {
      if (reason.response) {
        console.log('ERROR sending the fucking request to CHATBASE in AnalyticsReceived :: ', reason.response.data);
      } else {
        console.log('ERROR sending the fucking request to CHATBASE in AnalyticsReceived  :: ', reason);
      }
    }
  }

  async analyticSent(messageContent, messageId, entityAndFlow, version = '1.01', handled = false) {
    try {
      return (await axios.request({
        headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
        url: `https://chatbase.com/api/facebook/send_message?api_key=${process.env.CHATBASE_REQUEST_TOKEN}`,
        method: 'post',
        data: `{
          "request_body": {
            "recipient": {"id": '${process.env.SENDER_ID}'},
            "message": '${messageContent}' 
          },
          "response_body": {
            "recipient_id": '${process.env.SENDER_ID}',
            "message_id": '${messageId}'
          },
          "chatbase_fields": {
            "version": '${version}',
          }
        }`,
      })).data;
    } catch (reason) {
      if (reason.response) {
        console.log('ERROR sending the fucking request to CHATBASE in AnalyticsSent (the other function) :: ', reason.response.data);
      } else {
        console.log('ERROR sending the fucking request to CHATBASE in AnalyticsSent (the other function) :: ', reason);
      }
    }
  }
}

module.exports = chatbaseFunctions;

const getEntity = (exp) => {
  let expressions

  expressions = /^reset flows for/i
  if (expressions.test(exp)) { return 'resetFlowForUser' }

  expressions = /^help_paying_postback$/i
  if (expressions.test(exp)) { return 'paymentHelpDialog' }

  expressions = /^payment_complete_postback$/i
  if (expressions.test(exp)) { return 'paymentDialog_Final' }

  expressions = /^(share roo|share langroo|share this chatbot)$/i
  if (expressions.test(exp)) { return 'generalShareDialog' }

  expressions = /^broadcast_share_this$/i
  if (expressions.test(exp)) { return 'broadcastShare' }

  expressions = /^broadcast_user_start_now$/i
  if (expressions.test(exp)) { return 'broadcastRestart' }

  expressions = /^broadcast_user_start_later$/i
  if (expressions.test(exp)) { return 'broadcastStartLater' }

  expressions = /^broadcast_active_start_later$/i
  if (expressions.test(exp)) { return 'broadcastStartLaterActive' }

  expressions = /(^continue conversation with roo$|^continue bot$|^cancel_request$)/i
  if (expressions.test(exp)) { return 'continueCurrentFlow' }

  expressions = /^delete_account_init$/i
  if (expressions.test(exp)) { return 'confirmDeleteAccRequest' }

  expressions = /^yes_start_deleting_account$/i
  if (expressions.test(exp)) { return 'userDeleteAccSecondStep' }

  expressions = /^yes_confirm_account_deletion$/i
  if (expressions.test(exp)) { return 'accountDeletedMsg' }

  expressions = /^yes_stop_bot$/i
  if (expressions.test(exp)) { return 'stopBotMessages1' }

  expressions = /^full_restart$/i
  if (expressions.test(exp)) { return 'confirmRestartOfContent' }

  expressions = /^yes_restart_content$/i
  if (expressions.test(exp)) { return 'sendRestartedContent' }

  expressions = /^(reset|restart|restart bot|restart full conversation)$/i
  if (expressions.test(exp)) { return 'RESET' }

  expressions = /(^stop bot$|^freeze the current flow$|^unsuscribe$|^stop the content$|^cancel subscription$|^unsubscribe$|^stop$|^access payment(s)*$)/i
  if (expressions.test(exp)) { return 'BOT_STOP' }

  expressions = /(^help$|^dismiss bot and go to human$|^i need help$|^help me$|^Can a human speak to me\?*$)/i
  if (expressions.test(exp)) { return 'helpUser_Init' }

  expressions = /^yes_user_wants_help$/i
  if (expressions.test(exp)) { return 'helpUser1' }

  expressions = /^(upgrade subscription|subscribe me|learning plans|upgrade plan|pay|upgrade|payment|how do i pay\?*|i want to pay)$/i
  if (expressions.test(exp)) { return 'paymentDialog_Init' }

  expressions = /(^usd_currency$|^eur_currency$)/i
  if (expressions.test(exp)) { return 'paymentDialog1' }

  expressions = /(^now translate (\w+\s*)+|^I need the translation for\s(\w+\s*)+|^How do you say\s(\w+\s*)+\?|^translate\s(.+\s)+(in|into|to)\s(\w+(\s|$))+|^What does\s(\w+\s)+mean in\s(\w+(\s|$))+)/i
  if (expressions.test(exp)) { return 'DIRECT_TRANSLATE' }

  expressions = /^pronounce\s.+$/i
  if (expressions.test(exp)) { return 'pronounceThis' }

  expressions = /(^show_user_account$|^my profile$)/i
  if (expressions.test(exp)) { return 'userProfile' }

  expressions = /^custom_user_req$/i
  if (expressions.test(exp)) { return 'customUserRequest' }

  expressions = /^yes_create_profile$/i
  if (expressions.test(exp)) { return 'mustRegisterFirst' }

  expressions = /#AskRoo/i
  if (expressions.test(exp)) { return 'askRoo' }

  expressions = /^Pause Chatbot$/i
  if (expressions.test(exp)) { return 'inboxMode' }

  expressions = /^(send_monday_broadcast|send_friday_broadcast|send_wednesday_broadcast)$/i
  if (expressions.test(exp)) { return 'sendMessageBroadcast' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

const getEntity = (exp) => {
  let expressions

  expressions = /^broadcast_share_this$/i
  if (expressions.test(exp)) { return 'broadcastShare' }

  expressions = /^broadcast_user_start_now$/i
  if (expressions.test(exp)) { return 'broadcastRestart' }

  expressions = /^broadcast_user_start_later$/i
  if (expressions.test(exp)) { return 'broadcastStartLater' }

  expressions = /^broadcast_active_start_later$/i
  if (expressions.test(exp)) { return 'broadcastStartLaterActive' }

  expressions = /^(show pricing|pricing)$/i
  if (expressions.test(exp)) { return 'showPricing' }

  expressions = /^Restart content for this ID:\s*\[.*]$/i
  if (expressions.test(exp)) { return 'restartUserContent' }

  expressions = /(^continue conversation with roo$|^continue bot$|^cancel_request$)/i
  if (expressions.test(exp)) { return 'continueCurrentFlow' }

  expressions = /(^get how to converse$)/i
  if (expressions.test(exp)) { return 'howToConverseMenu' }

  expressions = /^delete_account_init$/i
  if (expressions.test(exp)) { return 'confirmDeleteAccRequest' }

  expressions = /^yes_start_deleting_account$/i
  if (expressions.test(exp)) { return 'userDeleteAccSecondStep' }

  expressions = /^yes_confirm_account_deletion$/i
  if (expressions.test(exp)) { return 'accountDeletedMsg' }

  expressions = /^yes_stop_bot$/i
  if (expressions.test(exp)) { return 'BS_FEEDBACK' }

  expressions = /^full_restart$/i
  if (expressions.test(exp)) { return 'confirmRestartOfContent' }

  expressions = /^yes_restart_content$/i
  if (expressions.test(exp)) { return 'sendRestartedContent' }

  expressions = /^(reset|restart|restart bot|restart full conversation)$/i
  if (expressions.test(exp)) { return 'RESET' }

  expressions = /(^stop bot$|^freeze the current flow$|^unsuscribe$|^stop the content$|^cancel subscription$|^unsubscribe$|^stop$|^access payment(s)*$)/i
  if (expressions.test(exp)) { return 'BOT_STOP' }

  expressions = /(^help$|^dismiss bot and go to human$|^i need help$|^help me$|^Can a human speak to me\?*$)/i
  if (expressions.test(exp)) { return 'confirmUserReqHelp' }

  expressions = /^yes_user_wants_help$/i
  if (expressions.test(exp)) { return 'userRequestsHelp' }

  expressions = /^(fortune_quote_now|inspiration)$/i
  if (expressions.test(exp)) { return 'FORTUNE_QUOTE' }

  expressions = /^(upgrade subscription|subscribe me|learning plans|upgrade plan|pay|upgrade|payment|how do i pay\?*|i want to pay)$/i
  if (expressions.test(exp)) { return 'startPaymentFlow' }

  expressions = /(^usd_currency$|^eur_currency$)/i
  if (expressions.test(exp)) { return 'showSubscriptions' }

  expressions = /(^now translate (\w+\s*)+|^I need the translation for\s(\w+\s*)+|^How do you say\s(\w+\s*)+\?|^translate\s(.+\s)+(in|into|to)\s(\w+(\s|$))+|^What does\s(\w+\s)+mean in\s(\w+(\s|$))+)/i
  if (expressions.test(exp)) { return 'DIRECT_TRANSLATE' }

  expressions = /^pronounce\s.+$/i
  if (expressions.test(exp)) { return 'pronounceThis' }

  expressions = /(^show_user_account$|^my profile$)/i
  if (expressions.test(exp)) { return 'userProfile' }

  expressions = /^(level_change_req|change level)$/i
  if (expressions.test(exp)) { return 'chooseNewLevel' }

  expressions = /^(accent_change_req|change accent)$/i
  if (expressions.test(exp)) { return 'chooseNewAccent' }

  expressions = /^change_level_or_accent$/i
  if (expressions.test(exp)) { return 'chooseWhatToChange' }

  expressions = /(^change_lvl_to_beg$|^change_lvl_to_int$|^change_lvl_to_adv$)/i
  if (expressions.test(exp)) { return 'newLevelConfirmation' }

  expressions = /(^change_accent_to_us$|^change_accent_to_uk$)/i
  if (expressions.test(exp)) { return 'newAccentConfirmation' }

  expressions = /^custom_user_req$/i
  if (expressions.test(exp)) { return 'customUserRequest' }

  expressions = /^yes_create_profile$/i
  if (expressions.test(exp)) { return 'mustRegisterFirst' }

  expressions = /#AskRoo/i
  if (expressions.test(exp)) { return 'askRoo' }

  expressions = /Pause Chatbot/i
  if (expressions.test(exp)) { return 'inboxMode' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

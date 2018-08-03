const getEntity = (exp) => {
  let expressions

  expressions = /^(get_started|initial_state|start_from_introduction_now)$/i
  if (expressions.test(exp)) { return 'getStarted' }

  expressions = /^(motivation is work|motivation is social life|motivation is university|motivation is school|motivation is english exams|motivation is job interviews|motivation is travel)$/i
  if (expressions.test(exp)) { return 'introDialog5' }

  expressions = /^(Found Roo by Influencer|Found Roo from Social Media|Found Roo Searching|Found Roo from Article|Found Roo by other means)$/i
  if (expressions.test(exp)) { return 'introDialog7' }

  expressions = /^motivation is other and will be asked$/i
  if (expressions.test(exp)) { return 'introDialog4Branch1' }

  expressions = /(^pd_beginner_level$|^pd_intermediate_level$|^pd_advanced_level$)/i
  if (expressions.test(exp)) { return 'introDialog6' }

  expressions = /^keep_going_with_intro_flow$/i
  if (expressions.test(exp)) { return 'introPostFinal' }

  expressions = /^keep_going_with_intro_flow$/
  if (expressions.test(exp)) { return 'introAltFinal' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

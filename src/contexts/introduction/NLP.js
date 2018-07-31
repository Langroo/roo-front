const getEntity = (exp) => {
  let expressions

  expressions = /^(get_started|initial_state|start_from_introduction_now)$/i
  if (expressions.test(exp)) { return 'getStarted' }

  expressions = /(^motivation is work$|^motivation is school$|^motivation is university$|^motivation is fun or challenge$|^motivation is english exams$|^motivation is job interviews$|^my job$)/i
  if (expressions.test(exp)) { return 'rooEnglishLevelQuestion' }

  expressions = /(user_age_14_to_18|user_age_19_to_23|user_age_24_to_30|user_age_31_to_40|user_age_41_to_50|user_age_51_or_more)/i
  if (expressions.test(exp)) { return 'rooLocationQuestion' }

  expressions = /^(Found Roo from School|Found Roo from Facebook Group|Found Roo by other means)$/i
  if (expressions.test(exp)) { return 'rooSpecifyLocation' }

  expressions = /^Found Roo by Influencer$/i
  if (expressions.test(exp)) { return 'rooSpecifyInfluencer' }

  expressions = /^Found Roo Searching$/i
  if (expressions.test(exp)) { return 'rooBigMotivQuestion' }

  expressions = /^motivation is other and will be asked$/i
  if (expressions.test(exp)) { return 'rooOtherMotivation' }

  expressions = /^(start_other_language|start_english_language)$/i
  if (expressions.test(exp)) { return 'askWhoIsRoo' }

  expressions = /(^pd_beginner_level$|^pd_intermediate_level$|^pd_advanced_level$)/i
  if (expressions.test(exp)) { return 'rooBigInterest' }

  expressions = /^(other interest and will ask)$/i
  if (expressions.test(exp)) { return 'rooOtherInterest' }

  expressions = /^(interested in Travelling|interested in Music|interested in Series\/Films|interested in Reading\/Learning|interested in Sports)$/i
  if (expressions.test(exp)) { return 'introFinal' }

  expressions = /^keep_going_with_intro_flow$/
  if (expressions.test(exp)) { return 'introAltFinal' }

  expressions = /^(us_accent_opt|uk_accent_opt)$/i
  if (expressions.test(exp)) { return 'tellHowRooCanHelp' }

  expressions = /^start_content_later_intro$/i
  if (expressions.test(exp)) { return 'introStartLater' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

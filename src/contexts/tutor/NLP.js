const getEntity = (exp) => {
  let expressions

  expressions = /^jump_from_intro_to_tutor$/i
  if (expressions.test(exp)) { return 'fromIntroPreTutorFlow' }

  expressions = /^go to benefits in tutor flow now$/i
  if (expressions.test(exp)) { return 'retakePreTutorFromReminder' }

  expressions = /^((I|get)*\s+(want|need)*\s+a\s+(tutor|professor|master|sensei|teacher)+(!)*)$/i
  if (expressions.test(exp)) { return 'initiateTutorFlow' }

  expressions = /^I will speak with a tutor later Roo, not now$/i
  if (expressions.test(exp)) { return 'willDoTutorLater' }

  expressions = /^tf_yes_init$/i
  if (expressions.test(exp)) { return 'tb0' }

  expressions = /^(TALK_TO_TUTOR|initiatePreTutorFlow|Upgrade to Tutor|request personal tutor|explore tutors| Explore Tutors| EXPLORE TUTORS)$/i
  if (expressions.test(exp)) { return 'exploreTutorFlow' }

  expressions = /^(tutor_answer_connection_really_bad|tutor_answer_connection_bad)$/i
  if (expressions.test(exp)) { return 'badConnection' }

  expressions = /^(tutor_answer_connection_ok|tutor_answer_connection_good|tutor_answer_connection_great)$/i
  if (expressions.test(exp)) { return 'goodConnection' }

  expressions = /^(tutor_answer_prices_user_cannot_pay)$/i
  if (expressions.test(exp)) { return 'userCannotPay' }

  expressions = /^(tutor_answer_user_can_pay)$/i
  if (expressions.test(exp)) { return 'userCanPay' }

  expressions = /^(tutor_answer_male_tutor)$/i
  if (expressions.test(exp)) { return 'maleTutor' }

  expressions = /^(tutor_answer_female_tutor)$/i
  if (expressions.test(exp)) { return 'femaleTutor' }

  expressions = /^(tutor_answer_either_tutor)$/i
  if (expressions.test(exp)) { return 'eitherTutor' }

  // expressions = /^(tutor_answer_have_question)$/i
  // if (expressions.test(exp)) { return 'haveQuestion' }

  // expressions = /^(tutor_answer_have_not_question)$/i
  // if (expressions.test(exp)) { return 'haveNotQuestion' }

  expressions = /(^tfb_morning$|^tfb_afternoon$|^tfb_evening$)/i
  if (expressions.test(exp)) { return 'confirmWhenToCallTutor' }

  expressions = /^tfb_yes_add$/i
  if (expressions.test(exp)) { return 'whenToCallTutor2' }

  expressions = /(^tfb_no_add$|^tfb_morning_alt$|^tfb_afternoon_alt$|^tfb_evening_alt$)/i
  if (expressions.test(exp)) { return 'daysGroupForCalls' }

  expressions = /(^tfb_weekdays$|^tfb_weekends$)/i
  if (expressions.test(exp)) { return 'internetSpeedDescription' }

  expressions = /^(Really_Bad_Internet|Bad_Internet|Ok_Internet|Good_Internet|Great_Internet)$/i
  if (expressions.test(exp)) { return 'knowThePrice' }

  expressions = /^continue_tutor_conversation$/i
  if (expressions.test(exp)) { return 'continueTutorFlow' }

  expressions = /^user_can_pay$/i
  if (expressions.test(exp)) { return 'userCanPayForTutor' }

  expressions = /^user_cannot_pay$/i
  if (expressions.test(exp)) { return 'userHasNoMoney' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

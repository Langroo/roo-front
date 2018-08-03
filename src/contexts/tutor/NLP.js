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

  expressions = /^(TALK_TO_TUTOR|initiatePreTutorFlow|Upgrade to Tutor|request personal tutor)$/i
  if (expressions.test(exp)) { return 'initiatePreTutorFlow' }

  expressions = /^(EXPLORE_TUTORS| explore tutors| Explore Tutors)$/i
  if (expressions.test(exp)) { return 'exploreTutorFlow' }

  expressions = /^(pre_tutor_answer_connection_really_bad|pre_tutor_answer_connection_bad)$/i
  if (expressions.test(exp)) { return 'PTconnectionBad' }

  expressions = /^(pre_tutor_answer_connection_ok|pre_tutor_answer_connection_good|pre_tutor_answer_connection_great)$/i
  if (expressions.test(exp)) { return 'PTconnectionOk' }

  expressions = /^(pre_tutor_answer_prices_user_cannot_pay)$/i
  if (expressions.test(exp)) { return 'PTuserCannotPay' }

  expressions = /^(pre_tutor_answer_user_can_pay)$/i
  if (expressions.test(exp)) { return 'PTuserCanPay' }

  expressions = /^(pre_tutor_answer_male_tutor)$/i
  if (expressions.test(exp)) { return 'PTmaleTutor' }

  expressions = /^(pre_tutor_answer_female_tutor)$/i
  if (expressions.test(exp)) { return 'PTfemaleTutor' }

  expressions = /^(pre_tutor_answer_either_tutor)$/i
  if (expressions.test(exp)) { return 'PTfeitherTutor' }

  expressions = /^(pre_tutor_answer_next_week|pre_tutor_answer_next_month)$/i
  if (expressions.test(exp)) { return 'PTnextWeekOrMonth' }

  expressions = /^pre_tutor_answer_never$/i
  if (expressions.test(exp)) { return 'PTneverRemindUser' }

  expressions = /^pre_tutor_answer_tell_me_now$/i
  if (expressions.test(exp)) { return 'PTtellUserNow' }

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

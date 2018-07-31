const getEntity = (exp) => {
  let expressions

  expressions = /^(stop_survey_now)$/i
  if (expressions.test(exp)) { return 'confirmTiredOfSurvey' }

  expressions = /^(continue_survey_flow)$/i
  if (expressions.test(exp)) { return 'continueSurvey' }

  expressions = /^(stop_survey_now)$/i
  if (expressions.test(exp)) { return 'confirmTiredOfSurvey' }

  expressions = /^(start_survey_flow_now)$/i
  if (expressions.test(exp)) { return 'surveyQuestion1' }

  expressions = /^(option1_not_important|option2_slightly_important|option3_important|option4_very_important|option5_extremely_important)$/i
  if (expressions.test(exp)) { return 'surveyQuestion2' }

  expressions = /^(other_problem_learning_option)$/i
  if (expressions.test(exp)) { return 'otherProblemLearning' }

  expressions = /^(english_is_boring_option|dont_have_motivation_option|dont_have_time_option|bad_teacher_option|other_problem_learning_option)$/i
  if (expressions.test(exp)) { return 'surveyQuestion3' }

  expressions = /^(learning_english_most_important_option|practicing_english_most_important_option|getting_corrected_most_important_option)$/i
  if (expressions.test(exp)) { return 'surveyQuestion5' }

  expressions = /^(learning_english_vocabulary_important|learning_english_conversation_important|learning_english_grammar_important|learning_english_listening_important)$/i
  if (expressions.test(exp)) { return 'surveyQuestion8' }

  expressions = /^(dont_like_idea_of_learning_with_friend|unsure_of_idea_of_learning_with_friend|maybe_like_idea_of_learning_with_friend|yes_like_idea_of_learning_with_friend|definitely_like_idea_of_learning_with_friend)$/i
  if (expressions.test(exp)) { return 'surveyQuestion9' }

  expressions = /^(dont_like_idea_of_bot_correcting_me|unsure_like_idea_of_bot_correcting_me|maybe_like_idea_of_bot_correcting_me|yes_like_idea_of_bot_correcting_me|definitely_like_idea_of_bot_correcting_me)$/i
  if (expressions.test(exp)) { return 'surveyQuestion10' }

  expressions = /^(no_dont_want_to_be_part_of_community)$/i
  if (expressions.test(exp)) { return 'noJoinCommunity' }

  expressions = /(maybe_make_me_part_of_community|yes_make_me_part_of_community)/i
  if (expressions.test(exp)) { return 'yesJoinCommunity' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

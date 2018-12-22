const getEntity = (exp) => {
  let expressions;

  expressions = /^(get_started|initial_state|start_from_introduction_now)$/i;
  if (expressions.test(exp)) { return 'getStarted'; }

  expressions = /^(speak_japanese|speak_english)$/i;
  if (expressions.test(exp)) { return '_userIsNewOrInvited'; }

  expressions = /^user_has_invite$/i;
  if (expressions.test(exp)) { return '_userHasInvite'; }

  expressions = /^user_is_new$/i;
  if (expressions.test(exp)) { return '_newUser'; }

  expressions = /^awaiting_our_first_call$/i;
  if (expressions.test(exp)) { return '_awaitingOurFirstCall'; }

  expressions = /^already_had_a_call$/i;
  if (expressions.test(exp)) { return '_alreadyHadACall'; }

  expressions = /^proceed_with_trial$/i;
  if (expressions.test(exp)) { return '_willProceedWithFreeTrial'; }

  expressions = /^dont_proceed_with_trial$/i;
  if (expressions.test(exp)) { return '_wontProceedWithFreeTrial'; }

  expressions = /^proceed_with_trial_with_a_friend$/i;
  if (expressions.test(exp)) { return '_freeTrialWithFriend'; }

  expressions = /^proceed_with_trial_by_myself$/i;
  if (expressions.test(exp)) { return '_freeTrialAlone'; }

  expressions = /^keep_going_with_intro_flow$/i;
  if (expressions.test(exp)) { return 'introPostFinal'; }

  expressions = /^user_wants_to_play_alone$/i;
  if (expressions.test(exp)) { return 'introFinal'; }

  return undefined;
};

module.exports = {
  handleExpression: getEntity,
};

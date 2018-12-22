const getEntity = (exp) => {
  const expressions = /^(rating_response_1|rating_response_2|rating_response_3|rating_response_4|rating_response_5|rating_response_6|rating_response_7|rating_response_8|rating_response_9|rating_response_10)$/i;
  if (expressions.test(exp)) { return 'getRating'; }

  return undefined;
};

module.exports = {
  handleExpression: getEntity,
};

// In here we analyze what we receive and define our own entities
// var exports = module.exports = {};

const getEntity = (exp) => {
  let expressions

  expressions = /^(next phrase|next|next lesson|on_demand_content_messages|learn)$/i
  if (expressions.test(exp)) { return 'sendContent' }

  return undefined
}

module.exports = {
  handleExpression: getEntity,
}

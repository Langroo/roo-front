/**
 * Export controller for introduction
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
};

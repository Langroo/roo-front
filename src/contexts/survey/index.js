/**
 * Export controller for survey
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
}

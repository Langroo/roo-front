/**
 * Export General Conversational Context and menu options
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
}

/**
 * Export controller for open conversation
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
  Dialogs: require('./responses').genericReplies
}

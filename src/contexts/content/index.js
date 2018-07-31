/**
 * Export Content
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
  contentReplies: require('./responses').standardReplies,
}

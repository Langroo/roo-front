/**
 * Export controller for open conversation
 */
module.exports = {
  controller: require('./controller'),
  NLP: require('./NLP').handleExpression,
  Dialogues: require('./responses').genericReplies,
};

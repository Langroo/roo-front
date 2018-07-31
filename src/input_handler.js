const getEntityAndFlow = (exp) => {

  // -- Import the contexts
  const flows = require('./contexts')

  // -- Define previous entities
  let entityAndFlow = { entity: undefined, flow: 'OpenTalk' }
  let handler

  handler = flows.general_NLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'general' }
  }
  handler = flows.introduction_NLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'introduction' }
  }
  handler = flows.surveyNLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'survey' }
  }
  handler = flows.tutor_NLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'tutor' }
  }
  handler = flows.OpenTalkNLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'OpenTalk' }
  }
  handler = flows.contentNLP(exp)
  if (handler) {
    return entityAndFlow = { entity: handler, flow: 'content' }
  }

  return entityAndFlow
}

module.exports = {
  getEntityAndFlow,
}

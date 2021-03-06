const getEntityAndFlow = (exp) => {
  // -- Import the contexts
  const flows = require('../contexts');

  // -- Define previous entities
  let handler;

  handler = flows.general_NLP(exp);
  if (handler) {
    return { entity: handler, flow: 'general' };
  }
  handler = flows.introduction_NLP(exp);
  if (handler) {
    return { entity: handler, flow: 'introduction' };
  }
  handler = flows.tutor_NLP(exp);
  if (handler) {
    return { entity: handler, flow: 'tutor' };
  }
  handler = flows.opentalkNLP(exp);
  if (handler) {
    return { entity: handler, flow: 'opentalk' };
  }

  return { entity: undefined, flow: 'opentalk' };
};

module.exports = {
  getEntityAndFlow,
};

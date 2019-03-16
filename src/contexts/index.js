/**
 * Export Content
 */
module.exports = {
  general: require('./general').controller,
  general_NLP: require('./general').NLP,
  tutor: require('./tutor').controller,
  tutor_NLP: require('./tutor').NLP,
  introduction: require('./introduction').controller,
  introduction_NLP: require('./introduction').NLP,
  opentalk: require('./open-talk').controller,
  opentalkNLP: require('./open-talk').NLP,
  opentalkDialogues: require('./open-talk').Dialogues,
  reminderReplies: require('./reminders').reminderReplies,
};

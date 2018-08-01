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
  OpenTalk: require('./open-talk').controller,
  OpenTalkNLP: require('./open-talk').NLP,
  OpenTalkDialogs: require('./open-talk').Dialogs,
  survey: require('./survey').controller,
  surveyNLP: require('./survey').NLP,
  content: require('./content').controller,
  contentNLP: require('./content').NLP,
  contentReplies: require('./content').contentReplies,
  reminderReplies: require('./reminders').reminderReplies,
  ratingController: require('./rating').controller,
  ratingNLP: require('./rating').NLP,
}
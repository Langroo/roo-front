const replyChooser = (replyName, senderName, choice = 'that') => {

  // Imports of external modules and libraries
  const OneForAll = require('../../../bot-tools').OneForAll
  const controllerSmash = new OneForAll()

  const randomResponses = [
    { type: 'text', content: 'So 😀, as I was saying... ' },
    { type: 'text', content: 'I know we got lost in conversation 😆, but...' },
    { type: 'text', content: 'What did I ask you again? 😶Ow yeah ☝️ ...' },
    { type: 'text', content: `I was waiting for you to respond below ${senderName} 😁👇` },
  ]

  const replies = {
    pressBtnFirstReminder: [
      { type: 'text', content: `Hey ${senderName}, I need you to select a button below 👇:` },
    ],
    pressBtnSecondReminder: [
      { type: 'text', content: 'Haha, hey! I need you to click a button below 👇' },
    ],
    after5HoursReminder: [
      { type: 'text', content: `Hey ${senderName}, are you there? :) I'm here when you need me!` },
    ],
    reliefOfUserContinuing: [
      { type: 'text', content: 'Phew! ☺️🙏' },
      { type: 'image', content: 'https://media1.tenor.com/images/6506e0b55eba4fceb4d4fb0a9c14bd5a/tenor.gif?itemid=10246345' },
      { type: 'text', content: 'haha, I thought we were lost forever! 💔' },
      { type: 'text', content: controllerSmash.shuffle(randomResponses)[0].content },
    ],
    askIfTiredOfSurvey: [
      {
        type: 'quickReplies',
        content: {
          title: `${senderName} are you tired of my questions already? haha, tell me what you would like to do 👇`,
          buttons: [
            { title: 'Continue Survey', value: 'continue_survey_flow' },
            { title: 'Stop Survey', value: 'stop_survey_now' },
          ],
        },
      },
    ],
    confirmTiredOfSurvey: [
      { type: 'text', content: 'Sure! If you want to help me later on, just write any time "I want to improve roo" ;)' },
    ],
    surveyQuestion1: [
      {
        type: 'quickReplies',
        content: {
          title: `1. How important is learning ✏️English for you ${senderName}? (1 = not that important, 5 = extremely important)`,
          buttons: [
            { title: '1', value: 'option1_not_important' },
            { title: '2', value: 'option2_slightly_important' },
            { title: '3', value: 'option3_important' },
            { title: '4', value: 'option4_very_important' },
            { title: '5', value: 'option5_extremely_important' },
          ],
        },
      },
    ],
    surveyQuestion2: [
      { type: 'text', content: 'Woo, 10% complete! 💥' },
      {
        type: 'quickReplies',
        content: {
          title: '2. Now, what’s your biggest problem 😅 for learning English?',
          buttons: [
            { title: 'English is boring', value: 'english_is_boring_option' },
            { title: 'Lack of motivation', value: 'dont_have_motivation_option' },
            { title: 'I don’t have time', value: 'dont_have_time_option' },
            { title: 'Bad teacher', value: 'bad_teacher_option' },
            { title: 'Other', value: 'other_problem_learning_option' },
          ],
        },
      },
    ],
    otherProblemLearning: [
      { type: 'text', content: 'Please tell me more 😁:' },
    ],
    surveyQuestion3: [
      { type: 'text', content: '20% complete! 💥' },
      { type: 'text', content: '3. What can I do to help you with that? Any ideas? 💡' },
    ],
    surveyQuestion4: [
      { type: 'text', content: 'Thanks! 30% complete! 💥' },
      {
        type: 'quickReplies',
        content: {
          title: '4. What is the most important for you? 😉',
          buttons: [
            { title: 'Learning English', value: 'learning_english_most_important_option' },
            { title: 'Practicing English', value: 'practicing_english_most_important_option' },
            { title: 'Getting Corrected', value: 'getting_corrected_most_important_option' },
          ],
        },
      },
    ],
    surveyQuestion5: [
      { type: 'text', content: 'Great! 40% finished! 💥' },
      { type: 'text', content: `5. What do you currently do for ${choice}? Write below 👇` },
    ],
    surveyQuestion6: [
      { type: 'text', content: '6. Ok, and what do you like 👍 and not like 👎 about what you said above?' },
    ],
    surveyQuestion7: [
      { type: 'text', content: `Wow, 60% already ${senderName}! 💥` },
      {
        type: 'quickReplies',
        content: {
          title: '7. For learning English, what is the most important 👊for you from these?',
          buttons: [
            { title: 'Vocabulary', value: 'learning_english_vocabulary_important' },
            { title: 'Conversation', value: 'learning_english_conversation_important' },
            { title: 'Grammar', value: 'learning_english_grammar_important' },
            { title: 'Listening', value: 'learning_english_listening_important' },
            { title: 'Other', value: 'other_thing_most_important' },
          ],
        },
      },
    ],
    otherMostImportant: [
      { type: 'text', content: 'Please tell me more 😁:' },
    ],
    surveyQuestion8: [
      { type: 'text', content: '70% done! 💥 We’re close!' },
      {
        type: 'quickReplies',
        content: {
          title: '8. Would you like the idea of: instead of learning with just me, you and a friend 👱🏽🙍 learn with me, and you compete against each other with daily challenges? 📹',
          buttons: [
            { title: 'No', value: 'dont_like_idea_of_learning_with_friend' },
            { title: 'Not sure', value: 'unsure_of_idea_of_learning_with_friend' },
            { title: 'Maybe', value: 'maybe_like_idea_of_learning_with_friend' },
            { title: 'Yes', value: 'yes_like_idea_of_learning_with_friend' },
            { title: 'Definitely', value: 'definitely_like_idea_of_learning_with_friend' },
          ],
        },
      },
    ],
    surveyQuestion9: [
      { type: 'text', content: 'Thanks! 80% done!! 💥 ' },
      {
        type: 'quickReplies',
        content: {
          title: '9. Would you like the idea of being able to speak to me about anything and I can correct ✏️your English grammar and misspellings as you speak?',
          buttons: [
            { title: 'No', value: 'dont_like_idea_of_bot_correcting_me' },
            { title: 'Not sure', value: 'unsure_like_idea_of_bot_correcting_me' },
            { title: 'Maybe', value: 'maybe_like_idea_of_bot_correcting_me' },
            { title: 'Yes', value: 'yes_like_idea_of_bot_correcting_me' },
            { title: 'Definitely', value: 'definitely_like_idea_of_bot_correcting_me' },
          ],
        },
      },
    ],
    surveyQuestion10: [
      { type: 'text', content: '90% done!! 💥 I can smell the finish line!' },
      {
        type: 'quickReplies',
        content: {
          title: '10. Would you like to improve your English by becoming part of our Langroo X Community? This is a group of students from around the world 🌍who are helping us build Roo? ',
          buttons: [
            { title: 'No thanks', value: 'no_dont_want_to_be_part_of_community' },
            { title: 'Maybe', value: 'maybe_make_me_part_of_community' },
            { title: 'Yes!', value: 'yes_make_me_part_of_community' },
          ],
        },
      },
    ],
    noJoinCommunity: [
      { type: 'text', content: `No problem ${senderName}, you are now 100% done 💥` },
      { type: 'text', content: 'We will keep you updated about our developments!' },
      { type: 'text', content: 'Have a great day! 💪' },
    ],
    yesJoinCommunity: [
      { type: 'text', content: 'Great, you can request to join here:\nhttps://www.facebook.com/groups/159822357948969/ 📱. ' },
      { type: 'text', content: 'Every Monday we give our community a weekly challenge :D' },
      { type: 'text', content: 'Have a great day! 💪' },
    ],
  }
  return replies[replyName]
}
module.exports = replyChooser

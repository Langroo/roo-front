const replyChooser = (replyName, senderId) => {
  const replies = {
    forgotAlready: [
      { type: 'text', content: 'I know you may have told me already 😖, but I sometimes I forget things 😭 #Shame' },
    ],
    askSchoolOrPlace: [
      { type: 'text', content: 'Good 😁' },
      {
        type: 'quickReplies',
        content:
        {
          title: 'First up, where did you hear about me?',
          buttons: [
              { title: 'School', value: 'quick_register_school_button' },
              { title: 'Other', value: 'quick_register_other_place_button' },
          ],
        },
      },
    ],
    askNameOfSchool: [
      { type: 'text', content: 'What\'s the name ✏ of it?' },
    ],
    askOtherPlace: [
      { type: 'text', content: 'Who, where or what made you find me? 🔎 ' },
    ],
    askPreferredAccent: [
      { type: 'text', content: 'Sweet! 😎' },
      {
        type: 'quickReplies',
        content: {
          title: 'Which accent would you like to focus 🔍on more, US 🇺🇸 or British English 🇬🇧? ',
          buttons: [
            { title: 'US', value: 'quick_register_us_accent' },
            { title: 'BRITISH', value: 'quick_register_uk_accent' },
          ],
        },
      },
    ],
    askPreferredLevel: [
      {
        type: 'quickReplies',
        content: {
          title: 'Finally, what\'s your level of English ✌ at the moment? 😛',
          buttons: [
            { title: 'Bad (Beginner) 👎', value: 'quick_register_beginner_level' },
            { title: 'Ok (Average) 👍', value: 'quick_register_intermediate_level' },
            { title: 'Strong (Advanced) ✊', value: 'quick_register_advanced_level' },
          ],
        },
      },
    ],
    askNameOfSchoolAlt: [
      { type: 'text', content: 'So, could you remind me the name of your school?' },
    ],
    askOtherPlaceAlt: [
      { type: 'text', content: 'So, could you remind me how did you find me?' },
    ],
    askPreferredAccentAlt: [
      { type: 'text', content: 'So, could you remind me which accent would you like to focus 🔍on more?' },
      {
        type: 'quickReplies',
        content: {
          title: 'The US 🇺🇸 or British English 🇬🇧? ',
          buttons: [
            { title: 'US', value: 'quick_register_us_accent' },
            { title: 'BRITISH', value: 'quick_register_uk_accent' },
          ],
        },
      },
    ],
    askPreferredLevelAlt: [
      {
        type: 'quickReplies',
        content: {
          title: 'So, could you remind me what\'s your level of English ✌ at the moment? 😛',
          buttons: [
            { title: 'Bad (Beginner) 👎', value: 'quick_register_beginner_level' },
            { title: 'Ok (Average) 👍', value: 'quick_register_intermediate_level' },
            { title: 'Strong (Advanced) ✊', value: 'quick_register_advanced_level' },
          ],
        },
      },
    ],
    answerThatWeHaveAll: [
      { type: 'text', content: 'Magnificent, it seems that we have all the info we need.' },
    ],
    registerWithLogin: [
      { type: 'text', content: 'Click ⬇️ on the “Get Started” button to finish your registration' },
      {
        type: 'card',
        content: {
          title: 'Access Roo\'s features and get daily messages!',
          subtitle: 'Click below to get started',
          imageUrl: 'https://user-images.githubusercontent.com/14140509/35827417-50b1e10e-0a92-11e8-927c-8915f1ab7a26.png',
          buttons: [
            {
              title: 'Get started',
              type: 'web_url',
              url: `${process.env.API_BASE_URL}/facebook/auth?senderId=${senderId}`,
            },
          ],
        },
      },
    ],
  }

  return replies[replyName]
}

module.exports = replyChooser


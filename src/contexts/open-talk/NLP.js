const getEntity = (exp) => {
  let expressions

  expressions = /^(tutor tryouts|tryouts|apply for tryouts|work for langroo|become a tutor|tutor interview)$/i
  if (expressions.test(exp)) { return 'tutorTryoutReply' }

  expressions = /^finished$/i
  if (expressions.test(exp)) { return 'finishedReply' }

  expressions = /(^autoresponder$|^no_do_not_delete_account$|^no_get_tutor$|^no_create_profile$|^no_change_level$|^no_change_accent$|^no_stop_bot$|^no_restart_bot$|^no_speak_to_native_tutor$)/i
  if (expressions.test(exp)) { return 'fallback' }

  expressions = /(^I want to improve you$|^I want to improve roo$|^I want to improve this bot$)/i
  if (expressions.test(exp)) { return 'willDoSurvey' }

  expressions = /^(tell me about fifa|I want to know about football|fifa|show me fifa|show me football|show me soccer)/i
  if (expressions.test(exp)) { return 'footballReply' }

  expressions = /^user_will_not_do_survey$/i
  if (expressions.test(exp)) { return 'wontDoSurvey' }

  expressions = /^(who created|who made)\s(yo)?u(\?)*$/i
  if (expressions.test(exp)) { return 'myCreatorReply' }

  expressions = /^(ok|cool|ok cool|ok, cool|fine)$/i
  if (expressions.test(exp)) { return 'agreementReply' }

  expressions = /^(haha+|jaja+)$/i
  if (expressions.test(exp)) { return 'laughterReply' }

  expressions = /^((are|r)\s(yo)?u\s(real|human|a human|a bot|a robot)\s?(or a robot|or a human)?(\?)*|am i talking to a bot\?*|who am i talking to\?*)$/i
  if (expressions.test(exp)) { return 'existenceReply' }

  expressions = /^(Who am i talking to|What is your name|What's your name|Who are you|who's there|who is there)(\?)*$/i
  if (expressions.test(exp)) { return 'identityReply' }

  expressions = /^((How old)\s(are|r)\s(yo)?u\?*|when were you born\?*)$/i
  if (expressions.test(exp)) { return 'ageReply' }

  expressions = /^(Where do you live|Where are you|where are you from)(\?)*$/i
  if (expressions.test(exp)) { return 'locationReply' }

  expressions = /^(How can you help me|What do you do|What can you do|How do you work|How can this work|What are you)(\?)*$/i
  if (expressions.test(exp)) { return 'functionReply' }

  expressions = /^(Which languages do you speak|How many languages do you speak|What languages do you speak|What language do you speak|What languages can you speak)(\?)*$/i
  if (expressions.test(exp)) { return 'languageReply' }

  expressions = /^Do you speak\s+\w+\?*$/i
  if (expressions.test(exp)) { return 'languageReply' }

  expressions = /^(How are you|What's up|Whats up|How's it going)\?*$/i
  if (expressions.test(exp)) { return 'whatsupReply' }

  expressions = /(I don't understand|i do not understand)/i
  if (expressions.test(exp)) { return 'missunderstandingReply' }

  expressions = /^(Are|r)\s(you|u)\s(still here|still there|here|there)\?*$/i
  if (expressions.test(exp)) { return 'areYouThereReply' }

  expressions = /^(Are|r)\s(you|u)\s(a boy or a girl|male or female|a man or a woman)\?*$/i
  if (expressions.test(exp)) { return 'genderReply' }

  expressions = /^(Teach me|I want to learn|Can you teach me|Teach me English|I want to learn now|Learn now|I want to learn English)(\?)*$/i
  if (expressions.test(exp)) { return 'teachMeReply' }

  expressions = /^(Menu|Settings|configuration|menu settings|menu setting)\?*$/i
  if (expressions.test(exp)) { return 'menuReply' }

  expressions = /^(Do you talk to other people\??|do you talk to others\??)$/i
  if (expressions.test(exp)) { return 'talkToOthersReply' }

  expressions = /^(hi|hello|greetings|wazzup|hey)\s*(langroo|roo|you|sweety|sweetheart|robot|ro|chatbot)*$/i
  if (expressions.test(exp)) { return 'salutationReply' }

  expressions = /^(go to hell|go fuck yourself|to hell with you)/i
  if (expressions.test(exp)) { return 'goToHellReply' }

  expressions = /^(do you believe in god\??|Does god exist\??)$/i
  if (expressions.test(exp)) { return 'believeInGodReply' }

  expressions = /^(you|u)\s(Are|r)\s(ugly|disgusting|hideous|respulsive)!*$/i
  if (expressions.test(exp)) { return 'youAreUglyReply' }

  expressions = /^What do you like about me\?*$/i
  if (expressions.test(exp)) { return 'likeAboutMeReply' }

  expressions = /^(Are|r)\s(you|u)\sin love\?*$/i
  if (expressions.test(exp)) { return 'areYouInLoveReply' }

  expressions = /^(bye|goodbye|bye bye|see ya|see you|see you later)!*$/i
  if (expressions.test(exp)) { return 'goodbyeReply' }

  expressions = /^(Goodnight|good night|Night)!*$/i
  if (expressions.test(exp)) { return 'goodnightReply' }

  expressions = /(wbu|what about you|you(\?)+)\?*/i
  if (expressions.test(exp)) { return 'whatAboutYouReply' }

  expressions = /^(thanks|thank|thank you)/i
  if (expressions.test(exp)) { return 'thanksReply' }

  expressions = /^what are your hobbies\?*$/i
  if (expressions.test(exp)) { return 'whatAreYourHobbiesReply' }

  expressions = /^what time is it\?*$/i
  if (expressions.test(exp)) { return 'whatTimeIsItReply' }

  expressions = /^Do you like \w\?*$/i
  if (expressions.test(exp)) { return 'doYouLikeKeywordReply' }

  expressions = /^do you love me\?*$/i
  if (expressions.test(exp)) { return 'doYouLoveMeReply' }

  expressions = /^tell me a secret$/i
  if (expressions.test(exp)) { return 'tellSecretReply' }

  expressions = /^do you remember me\?*$/i
  if (expressions.test(exp)) { return 'doYouRememberMeReply' }

  expressions = /^(I'm|I am)\slooking forward to/i
  if (expressions.test(exp)) { return 'lookingForwardToReply' }

  expressions = /^(i am|I'm|i feel)\s(bored|disinterested|tired|fatigued|dull|turned off|spiritless)/i
  if (expressions.test(exp)) { return 'feelingBoredReply' }

  expressions = /^when\s(are|r)\s(you|u)\s(online|available)\?*$/i
  if (expressions.test(exp)) { return 'whenYouOnlineReply' }

  expressions = /^I hate you$/i
  if (expressions.test(exp)) { return 'hateReply' }

  expressions = /^(How much is it|Is this free|How much does this cost|What's the price|Is it free|What's the cost|Cost|Prices|Payment|How do I pay|What courses do you have|What programmes do you have)\?*$/i
  if (expressions.test(exp)) { return 'pricingReply' }

  expressions = /^(A|a)re you in love(\?*)$/i
  if (expressions.test(exp)) { return 'loveReply' }

  expressions = /(M|m)erci/i
  if (expressions.test(exp)) { return 'thanksReply' }

  expressions = /^(Cost|Prices|Payment|Is this free|What's the cost|How do i pay|What courses do you have|What programmes do you have|What's the price|How much does this cost|How much is it)$/i
  if (expressions.test(exp)) { return undefined }

  expressions = /^(en taro adun|for aiur|my life for aiur|for the firstborn|terran(s)? (masterrace|master race)|the khala)!*$/i
  if (expressions.test(exp)) { return 'starcraftReply' }

  expressions = /(Fuck|Shit|Dick|Asshole|bitch|bastard|cunt|bollocks|sex|wanker|blow job|pussy|tits|boobs|wank|gay)/i
  if (expressions.test(exp)) { return 'badWordsReply' }

  return undefined
}

module.exports = { handleExpression: getEntity }

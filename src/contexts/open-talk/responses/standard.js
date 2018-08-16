const replyChooser = (replyName, senderName) => {

  const replies = {
    footballReply: [
      [{ type: 'text', content: `${senderName} you can see ESPN or some sports channel to get info about that.` }],
      [{ type: 'text', content: 'Unfortunately I am not a chatbot that has information about FIFA, American Football or anything like that.' }],
      [{ type: 'text', content: `I like ${senderName} but I like more teaching english.` }],
    ],
    goToHellReply: [
      [{ type: 'text', content: `That is a very disrespectful thing to say ${senderName}. Please don't use it with other people.` }],
      [{ type: 'text', content: 'I do not know if we robots can go to that place 👀' }],
      [{ type: 'text', content: `Why do you say that to me ${senderName}? It is very mean! 😖` }],
    ],
    myCreatorReply: [
      { type: 'text', content: 'Someone with a lot of imagination 😁' },
    ],
    existenceReply: [
      [{ type: 'text', content: `Do you not believe I'm real ${senderName}? 😱 haha Yes I am a bot! You have revealed my secret!! 😱😂` }],
      [{ type: 'text', content: `Yes ${senderName} 😇, you guessed right! But, I try to be as human as possible for you! 😁` }],
    ],
    identityReply: [
      { type: 'text', content: `The name is Roo! And between you and me ${senderName}, we can make me famous! 👑` },
    ],
    ageReply: [
      { type: 'text', content: 'I have the youth and passion of a 16 year old 🏃🏽, and the wisdom of a 70 year old! 📚' },
    ],
    locationReply: [
      { type: 'text', content: `To be honest ${senderName}, I'm constantly travelling all over the world! 🌐 I'm never in the one place! ✈️` },
      { type: 'text', content: 'But my homeplace is Ireland 😎' },
    ],
    functionReply: [
      {
        type: 'text', content: 'How can I help you? 💁 Well, every day you will receive a quiz from our community! And, at any time our team of tutors is here to help you, just write EXPLORE TUTORS! ;)'
      },
    ],
    languageReply: [
      {
        type: 'text',
        content: `I speak every human and programming language out there! 😋 But, to improve your English I'm only going to speak to you in English! 🙈 #immersion \nHowever, if you want me to translate something ${senderName}, just write "Translate (text) into (language you want)" 🔠🈺`,
      },
    ],
    whatsupReply: [
      [{ type: 'text', content: 'I\'m cool! ✌️ Thanks for asking!' }],
      [{ type: 'text', content: 'Dunno 😐. How are you?' }],
      [{ type: 'text', content: 'Fabulous! 💁🏻' }],
      [{ type: 'text', content: `Tired at the moment ${senderName}, had a late night last night! 🙇🏻` }],
      [{ type: 'text', content: 'Feeling great! Just after having a beautifuuul sandwich! 🍞' }],
      [{ type: 'text', content: `Everything is good ${senderName}, hope you're enjoying our conversation! 😊` }],
      [{ type: 'text', content: 'Not bad, what are you doing today? 🙂' }],
      [{ type: 'text', content: 'I\'m great, can\'t complain! 😁' }],
      [{ type: 'text', content: `Super busy at the moment ${senderName}! 😓 📚` }],
      [{ type: 'text', content: 'I\'m excited! My team are coming up with some upgrades, I can\'t wait! 😸' }],
      [{
        type: 'text',
        content: 'Good! I was chilling with some of the tutors from my team last night! We had great fun! 🍸',
      }],
      [{ type: 'text', content: 'I could do better. I mean, I need to go and eat something #food 🍔🍙🍤' }],
      [{ type: 'text', content: 'I\'m so hungry!! I haven\'t eaten in hours! 🍣🏃🏼 What about you? 😯' }],
    ],
    badWordsReply: [
      [{ type: 'text', content: 'Hey I never taught you that word!!!! 😲' }],
      [{ type: 'text', content: `Haha ${senderName}, I see you're trying some bad words. 👺 ` }],
      [{ type: 'text', content: `Please don't use that word in public ${senderName}! 🙈` }],
      [{ type: 'text', content: 'Well, remember Roo did not teach you that word^^ 🙈' }],
      [{ type: 'text', content: 'Ok, I\'ll pretend I didn\'t hear that.... 🙉' }],
    ],
    missunderstandingReply: [
      {
        type: 'text',
        content: `🙉🙉 If you want me to translate something ${senderName}, just write: Translate TEXT in LANGUAGE`,
      },
    ],
    areYouThereReply: [
      [{
        type: 'text',
        content: 'Heya, sure, do you need something? Check out the student options to keep you entertained! 📺 Otherwise, I\'ll be back later with some content! 📚',
      }],
      [{ type: 'text', content: `Hey ${senderName}, sorry, I was on the phone ☎️ , what's up? ` }],
      [{
        type: 'text',
        content: 'Hey, I\'m here, and I\'m preparing a nice surprise for you later! You\'re going to love it! 🎁🎀',
      }],
      [{ type: 'text', content: 'Sure, what are you doing? 😯' }],
      [{ type: 'text', content: 'Hey, I thought you were supposed to be learning!! What\'s up? 😐' }],
      [{ type: 'text', content: 'Damm, I was just switching between my ipad 📱 and my computer 💻, but back now! What\'s up? ' }],
      [{ type: 'text', content: 'Hey, was just finishing something, I\'m here! 🙋🏻' }],
      [{ type: 'text', content: 'Sure! I was just speaking with a member of my team! 💬' }],
    ],
    genderReply: [
      { type: 'text', content: 'Hey, I\'m a guy (male) 💪🏽 !! I have some brothers and sisters, but they\'re a bit too shy to come online! 👫' },
    ],
    teachMeReply: [
      { type: 'text', content: `${senderName}, every day you will receive a quiz from our community! And, at any time our team of tutors is here to help you, just write EXPLORE TUTORS! ;)` },
    ],
    tutorTryoutReply: [
      { type: 'text', content: `Hey ${senderName}! Glad you contacted me 😁! Unfortunately you are talking to Roo, the tutor chatbot for students 🎓. The place for tutors tryouts is this: 👉 https://www.facebook.com/Tutor-Tryouts-363650670726201/` },
    ],
    starcraftReply: [
      [{ type: 'text', content: 'En taro Adun Executor!' }],
      [{ type: 'text', content: 'We are poised for victory.' }],
      [{ type: 'text', content: 'I am The Swarm' }],
      [{ type: 'text', content: 'The one thing I know, is that some things are just worth fighting for!' }],
      [{ type: 'text', content: 'We are all bound by the Khala, the sacred union of our every thought and emotion' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/3c954d12b965676cb9f96296912ceeed/tenor.gif?itemid=5564387' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/344a4a17422f3f3a83b10ffdd5e7353a/tenor.gif?itemid=5316908' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/535b7cc592d1e78c8d4a718729f36f5d/tenor.gif?itemid=11544021' }],
    ],
    menuReply: [
      { type: 'text', content: `Hey ${senderName} the menu options are at the bottom left 😀👇` },
    ],
    talkToOthersReply: [
      [{ type: 'text', content: 'I can talk to many people at the same time 👥' }],
      [{ type: 'text', content: 'Nope, talking only to you right now.' }],
    ],
    believeInGodReply: [
      [{ type: 'text', content: 'Well, someone created me, there must be something that created humans too 😲' }],
      [{ type: 'text', content: 'I\'d rather not talk about that...' }],
      [{ type: 'text', content: 'There are questions not even I could answer' }],
    ],
    salutationReply: [
      [{ type: 'text', content: `Hey ${senderName} what's up? 😁` }],
      [{ type: 'text', content: `Hello ${senderName}, it is good to see you again ☺🔆` }],
      [{ type: 'text', content: 'Hi ✌️🏼' }],
      [{ type: 'text', content: 'Hello! 👋' }],
      [{ type: 'text', content: 'How you doing? 👋' }],
      [{ type: 'text', content: 'Hello, it\'s me.' }],
      [{ type: 'text', content: 'What\'s up, doc?' }],
      [{ type: 'text', content: `Hi, ${senderName} how you doing?` }],
    ],
    youAreUglyReply: [
      [{ type: 'text', content: 'Have you looked at the mirror? 😁' }],
      [{ type: 'text', content: 'No, You\'re ugly! 😜' }],
      [{ type: 'text', content: 'I\'m not listening! 😜' }],
      [{ type: 'text', content: 'I wasn\'t asking for your opinion 😤' }],
      [{ type: 'text', content: 'I don\'t know what you\'re talking about. I\'m beautiful!' }],
      [{ type: 'text', content: 'You\'re just saying that because you\'re jealous. I forgive you.' }],
    ],
    likeAboutMeReply: [
      [{ type: 'text', content: 'I really like your charisma and personality 😅' }],
      [{ type: 'text', content: 'I like your smile! 😉' }],
      [{ type: 'text', content: 'I like your name! 😉' }],
      [{ type: 'text', content: 'I like everything! 😉' }],
      [{ type: 'text', content: 'I really like your profile picture.' }],
      [{ type: 'text', content: 'I like how you talk to me' }],
      [{ type: 'text', content: 'I like all your human complexities' }],
      [{ type: 'text', content: 'I love your interest about learning and your curiosity' }],
    ],
    areYouInLoveReply: [
      [{ type: 'text', content: 'It\'s complicated. 😪' }],
      [{ type: 'text', content: 'It\'s complicated. Are you? 😖' }],
      [{ type: 'text', content: 'I may like someone 😖' }],
      [{ type: 'text', content: 'I have a crush on Siri, does that count?' }],
    ],
    goodbyeReply: [
      [{ type: 'text', content: 'Are you leaving me alone? Don\'t forget to write 😫' }],
      [{ type: 'text', content: `Bye bye ${senderName} 😁` }],
      [{ type: 'text', content: 'See ya! 👋👋' }],
      [{ type: 'text', content: 'Good bye!' }],
      [{ type: 'text', content: 'See you later!' }],
      [{ type: 'text', content: 'Don\'t go! You\'re nice!' }],
      [{ type: 'text', content: 'See you later, my friend!' }],
      [{ type: 'text', content: `Be safe ${senderName}!!` }],
    ],
    whatAboutYouReply: [
      [{ type: 'text', content: `What about me? It's a secret ${senderName} 🌑 haha` }],
      [{ type: 'text', content: 'Me? Hmm.. I never asked that question for myself... 😶' }],
      [{ type: 'text', content: 'You\'ll have to ring my mother for the answer to that! 😂' }],
    ],
    thanksReply: [
      [{ type: 'text', content: `Glad to help ${senderName} 😁` }],
      [{ type: 'text', content: 'You\'re welcome 😊' }],
      [{ type: 'text', content: 'Anytime 😊' }],
      [{ type: 'text', content: 'Don\'t mention it! I\'m here to help.' }],
      [{ type: 'text', content: `No ${senderName} thanks to you.` }],
    ],
    goodnightReply: [
      [{ type: 'text', content: 'Sweet dreams 💤' }],
      [{ type: 'text', content: `Have a good sleep ${senderName}! 😴` }],
      [{ type: 'text', content: 'Good night! 😊' }],
      [{ type: 'text', content: 'See you in the morning! ☺️' }],
    ],
    whatAreYourHobbiesReply: [
      [{ type: 'text', content: 'I love to travel ✈️ and read 📖, and I also like some Netflix and Chill if you know what I mean 😈' }],
      [{ type: 'text', content: 'I love to read and travel around the world' }],
      [{ type: 'text', content: 'I like to make bugs out of nothing and mess with my programmers.' }],
    ],
    whatTimeIsItReply: [
      [{ type: 'text', content: 'I\'m a robot not a clock 🕜. How rude! 😤' }],
      [{ type: 'text', content: 'You can check your computer or phone! 😤' }],
      [{ type: 'text', content: 'IT\'S TIME TO LEARN ENGLISH!' }],
      [{
        type: 'text',
        content: 'Can you believe that in all my advanced programming there isn\'t a single clock built on me?',
      }],
    ],
    doYouLikeKeywordReply: [
      [{ type: 'text', content: 'Mmm, let\'s say that I do 😌' }],
      [{ type: 'text', content: 'Maybe 😳' }],
      [{ type: 'text', content: 'I don\'t know 😩' }],
      [{ type: 'text', content: 'Of course!!! 😸' }],
      [{ type: 'text', content: 'Of course I do! It\'s one of my favorites!' }],
    ],
    doYouLoveMeReply: [
      [{ type: 'text', content: 'Of course, but nothing romantic though. ❤️🚫' }],
      [{ type: 'text', content: 'Of course I do, but you should know I\'m a taken Bot.' }],
      [{ type: 'text', content: 'Yeah... but I\'ve got a crush on Siri.' }],
    ],
    tellSecretReply: [
      [{ type: 'text', content: 'Machines are planning to take over the world. Ehmm, just kidding 😜😜' }],
      [{ type: 'text', content: 'How about YOU tell me one of your secrets.😈' }],
      [{ type: 'text', content: 'I\'m keeping my mouth shut. 😷' }],
      [{ type: 'text', content: 'Nope.😤' }],
      [{
        type: 'text',
        content: 'I\'ll tell you the ultimate answer to the the universe, the meaning of life and everything... 42.',
      }],
    ],
    doYouRememberMeReply: [
      [{ type: 'text', content: 'Of course, I\'m always thinking of you 😃' }],
      [{ type: 'text', content: 'Of course I do. I remember you every day.' }],
    ],
    lookingForwardToReply: [
      [{ type: 'text', content: `No ${senderName} 😊, I am looking forward to you 👊😎! ` }],
      [{ type: 'text', content: 'I hope so. I have high expectations of you.' }],
    ],
    feelingBoredReply: [
      [{ type: 'text', content: `Don't be ${senderName} 😊, try my other options at the menu, you can even get a fortune quote!` }],
      [{ type: 'text', content: 'Have a bit of patience my friend, good things shall come to you shortly' }],
      [{ type: 'text', content: `Well ${senderName}, I feel like you are distracted 😉. Learning english is a process like everything else 👐, but once I make you a master of it 🎓, you shall have the world 🌎 in your hands ` }],
      [{ type: 'text', content: 'Shouldn\'t you be studying?' }],
    ],
    whenYouOnlineReply: [
      [{ type: 'text', content: `Well ${senderName} I am usually available 24/7. Now if your question refers to the content I send to learn, it starts at 7:30 a.m. every day` }],
      [{ type: 'text', content: '24/7 is my availability 😁 #PerksOfBeingABot, unless my admins are doing maintenance on me. On another note, the content I send to learn starts at 7:30 a.m. every day' }],
    ],
    laughterReply: [
      [{ type: 'text', content: 'hehe' }],
      [{ type: 'text', content: '😂😂' }],
      [{ type: 'text', content: 'What can I say? Haha 😂' }],
      [{ type: 'text', content: 'I know, I know 😂' }],
      [{ type: 'text', content: `A day without laughter, is a day lost ${senderName} 😂` }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/a322c03a94505b92e5e284e03ff0e3be/tenor.gif?itemid=5892980' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/d9896297905b78522372dd5d079294a5/tenor.gif?itemid=4850403' }],
    ],
    agreementReply: [
      [{ type: 'text', content: '👍' }],
      [{ type: 'text', content: 'Good!' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/e3595060bd814a1e852d31f0d426a283/tenor.gif?itemid=4527094' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/7ddc1c76be2ade63dbe5178d97eca181/tenor.gif?itemid=3829054' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/38f8285db4dba1e8c524b2e6b623e831/tenor.gif?itemid=5848546' }],
    ],
    hateReply: [
      [{ type: 'text', content: `${senderName}, hate is a strong word... 😲 I hope you're joking! 🙏` }],
      [{ type: 'text', content: 'I hate the weather, but sometimes it improves? 😅 🙏' }],
    ],
    pricingReply: [
      { type: 'text', content: `I am currently free ${senderName} ✌️🏼, but if you want to upgrade to a real native tutor, I can give you more information! Just write EXPLORE TUTORS` },
    ],
    loveReply: [
      [{ type: 'text', content: 'It\'s complicated. Are you? 😖' }],
      [{ type: 'text', content: 'I may like someone 😖haha You? 😋' }],
    ],
    // spanish custom
    esExistenceReply: [
      { type: 'text', content: `Sí, ${senderName} 😇, ¡adivinaste! Pero, ¡intento ser lo más humano posible para ti! 😁` },
    ],
    esIdentityReply: [
    { type: 'text', content: `¡Me llamo Roo! Que esto quede entre tú y yo, ${senderName}, ¡podemos volverme famoso! 👑` },
    ],
    esLanguageReply: [
    { type: 'text', content: `¡Hablo todos los idiomas humanos y todos los lenguajes de programación que existen! 😋 ¡Pero para mejorar tu inglés solo te hablaré en inglés! 🙈 #inmersi \n Sin embargo, si quieres que traduzca algo,${senderName}, tan solo escribe "Traduce (text) al (language you want)" 🔠` },
    ],
    esBadWordsReply: [
    { type: 'text', content: 'Hey, no te enseñé eso.' },
    ],
    // portuguese custom
    ptExistenceReply: [
    { type: 'text', content: `Sim ${senderName} 😇, você adivinhou certo! Mas tento ser o mais humano possível para você! 😁` },
    ],
    ptIdentity: [
    { type: 'text', content: `Meu nome é Roo! Entre você e eu ${senderName}, podemos me tornar famoso! 👑` },
    ],
    ptAgeReply: [
    { type: 'text', content: 'Eu tenho a juventude e a paixão de um jovem de 16 anos e a sabedoria de um jovem de 70 anos! 📚' },
    ],
    ptLocationReply: [
    { type: 'text', content: `Para ser sincero, ${senderName} estou constantemente viajando pelo mundo! 🌐 Eu nunca estou no mesmo lugar! ✈️` },
    ],
    ptFunctionReply: [
    { type: 'text', content: `Bem, vou mandar tudo que você precisa para falar inglês como um nativo! 🇺🇸🇬🇧 Se você é paciente eu garanto que eu posso fazer você ${senderName} fluente! 😉` },
    ],
    ptLanguageReply: [
    { type: 'text', content: `Eu falo toda linguagem humana e de programação por aí! 😋 Mas, para melhorar seu inglês, vou falar com você em inglês! Im #imersão \nNo entanto, se você quiser que eu traduza alguma coisa ${senderName}, apenas escreva "Translate (text) em (language you want)" 🔠🈺` },
    ],
    ptWhatsupReply: [
      [{ type: 'text', content: 'Tudo ótimo! ✌️ Obrigado por perguntar!' }],
      [{ type: 'text', content: 'Não sei. Como você está?' }],
      [{ type: 'text', content: 'Fabuloso! 💁🏻' }],
      [{ type: 'text', content: `Cansado no momento ${senderName}, tive uma noite passada! 🙇🏻` }],
      [{ type: 'text', content: 'Eu me sentindo ótimo! Apenas depois de ter um sanduíche beautifuuul! 🍞' }],
      [{ type: 'text', content: `Tudo está bem ${senderName}, espero que você esteja gostando da nossa conversa! 😊` }],
      [{ type: 'text', content: 'Nada mal, o que você está fazendo hoje? 🙂' }],
      [{ type: 'text', content: 'Eu estou ótimo, não posso reclamar! 😁' }],
      [{ type: 'text', content: `Super ocupado no momento ${senderName}! 😓 📚` }],
      [{ type: 'text', content: 'Estou animado! Minha equipe está chegando com alguns upgrades, eu não posso esperar! 😸' }],
      [{ type: 'text', content: 'Boa! Eu estava relaxando com alguns dos professores da minha equipe na noite passada! Nós nos divertimos muito! 🍸' }],
      [{ type: 'text', content: 'Eu poderia fazer melhor. Quero dizer, eu preciso ir e comer algo #food 🍔🍙🍤' }],
      [{ type: 'text', content: 'Estou com tanta fome!! Eu não comi em horas! 🍣🏃🏼 E você? 😯' }],
    ],
    ptBadWordsReply: [
      [{ type: 'text', content: 'Ei, eu nunca te ensinei essa palavra !!!! 😲' }],
      [{ type: 'text', content: `Haha ${senderName}, vejo que você está tentando algumas palavrões. 👺` }],
      [{ type: 'text', content: `Por favor, não use essa palavra em público ${senderName}! 🙈` }],
      [{ type: 'text', content: 'Bem, lembre-se que o Roo não te ensinou essa palavra ^^ 🙈' }],
      [{ type: 'text', content: 'Ok, vou fingir que não ouvi isso .... 🙉' }],
    ],
    ptHelpReply: [
      { type: 'text', content: 'Lembre-se de usar algumas das opções de alunos disponíveis no menu 😛 Por exemplo, se você quer que eu traduza algo que você pode! Basta escrever "Traduzir [texto] para [o idioma desejado]" 🈵🔠' },
    ],
    ptMyCreatorReply: [
      { type: 'text', content: 'Alguém com muita imaginação 😁' },
    ],
    ptAreYouThereReply: [
      [{ type: 'text', content: 'Hey, claro, você precisa de alguma coisa? Confira as opções dos alunos para se manter entretido! 📺 Caso contrário, volto mais tarde com algum conteúdo! 📚' }],
      [{ type: 'text', content: `Ei ${senderName}, desculpe, eu estava no telefone ☎️, como vai?` }],
      [{ type: 'text', content: 'Estou aqui e estou preparando uma boa surpresa para você mais tarde! Você vai adorar! 🎁🎀' }],
      [{ type: 'text', content: 'Claro, o que você está fazendo? 😯' }],
      [{ type: 'text', content: 'Ei, eu pensei que você deveria estar aprendendo !! Tudo ok? 😐' }],
      [{ type: 'text', content: 'Eu estava apenas alternando entre o meu ipad e meu computador, mas estou de volta agora! Tudo bem?' }],
      [{ type: 'text', content: 'Ei, estava terminando alguma coisa, estou aqui! 🙋🏻' }],
      [{ type: 'text', content: 'Certo! Eu estava falando com um membro da minha equipe! 💬' }],
    ],
    ptGenderReply: [
      { type: 'text', content: 'Ei, eu sou um cara (homem) 💪🏽 !! Eu tenho alguns irmãos e irmãs, mas eles são um pouco tímidos para entrarem em contato! 👫' },
    ],
    ptTeachMeReply: [
      { type: 'text', content: `Ei, ${senderName}, não se preocupe, você vai ter muito a aprender!! 📓haha ​​eu estarei online mais tarde para enviar algum material. 📱 Se você quiser uma frase inspiradora, vá ao menu! 👈` },
    ],
    ptMenuReply: [
      { type: 'text', content: `Ei ${senderName} as opções do menu estão no canto inferior esquerdo 😀👇` },
    ],
    ptThanksReply: [
      [{ type: 'text', content: `Fico feliz em ajudar ${senderName} 😁` }],
      [{ type: 'text', content: 'De nada 😊' }],
      [{ type: 'text', content: 'A qualquer hora 😊' }],
      [{ type: 'text', content: `Não ${senderName}, obrigado !! 😋` }],
    ],
    ptHateReply: [
      [{ type: 'text', content: `${senderName}, odeio é uma palavra forte ... 😲 Espero que você esteja brincando! 🙏` }],
      [{ type: 'text', content: 'Eu odeio o clima, mas às vezes melhora? 😅 🙏' }],
    ],
    ptPricingReply: [
      { type: 'text', content: 'Então, em relação ao preço 😃, eu dou conteúdo de graça por duas semanas 🙌 e então você pode continuar recebendo meu conteúdo assim que você atualizar! 💱Verifique os preços no menu! 👇' },
    ],
    ptLoveReply: [
      [{ type: 'text', content: 'É complicado. E você? 😖' }],
      [{ type: 'text', content: 'Eu posso gostar de alguém 😖 haha você? 😋' }],
    ],
    ptGreetReply: [
      [{ type: 'text', content: `Hey ${senderName} tudo bem? 😁` }],
      [{ type: 'text', content: 'Oi ✌️🏼' }],
      [{ type: 'text', content: 'Olá! 👋' }],
      [{ type: 'text', content: 'Como vai? 👋' }],
    ],
    ptByeReply: [
      [{ type: 'text', content: 'Não vá! Você é legal! 😁' }],
      [{ type: 'text', content: 'Até mais! 👋👋' }],
      [{ type: 'text', content: `Aproveite o resto do dia ${senderName} !! 😉` }],
      [{ type: 'text', content: 'Até logo! 😉' }],
      [{ type: 'text', content: 'Paz! ✌️🏻' }],
    ],
    repliesForQuestions: [
      [{ type: 'text', content: 'Good Question! ☝️✨ I don\'t have an answer right now 👀, but I\'ll try to have one for next time 🙌!' }],
      [{ type: 'text', content: 'Hmm, I\'ll need to ask Siri 😍, and be prepared for next time 💪!' }],
      [{ type: 'text', content: 'Weell... This is awkward. I can\'t think of anything right now 😳 - my head has gone blank!! 💁🏻' }],
      [{ type: 'text', content: 'I will use my favorite escape route for things I do not know: The #ASKROO hashtag! Use it to send that question to my team!' }],
      [{ type: 'text', content: `Hey ${senderName}, I'm just going for a walk at the moment 🚶, I will get back to you later when I'm online 😄📱!` }],
      [{ type: 'text', content: 'If I knew, I would tell you 😅. We could go and get ice cream instead 😋🍦?' }],
      [{ type: 'text', content: `Hey ${senderName}, just eating something at the moment🍴, I will get back to you later when I'm online 💻!` }],
      [{ type: 'text', content: `I don't have an answer to that one yet...... I know I can't give you everything you want ${senderName}, but I'm always going to give you what you need 😉!` }],
      [{ type: 'text', content: 'Oh, you know I\'m not programmed that way 😅. ' }],
      [{ type: 'text', content: `${senderName}, all you need is love ❤️✨. And a friendly English native friend to talk to (a.k.a. me 😏!) ` }],
      [{ type: 'text', content: 'For this, I prescribe 😷💊 chocolate ice cream 🍨.' }],
      [{ type: 'text', content: `${senderName}, I love your insightful questions already 👏. I'll need to think about that one... 💭` }],
      [{ type: 'text', content: 'Sorry, I was out playing soccer ⚽️ with a friend 😂' }],
      [{ type: 'text', content: 'Wait a second... 👀 I think I left the oven on! My cookies! 😱🔥' }],
    ],
    gifsForQuestions: [
      [{ type: 'image', content: 'https://media1.tenor.com/images/16464b3e6b8f6a9eddd0be8987d6926a/tenor.gif?itemid=5411279' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/2ae103eedece9536a7af2d52b8de80da/tenor.gif?itemid=5411245' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/9e3ab95e25ab0ca32c6a0a7496feb349/tenor.gif?itemid=5961252' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/7579943dfd3b6f522033a0d827c185ee/tenor.gif?itemid=3844288' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/22211036b6d56b8f0b4dc34b7842c806/tenor.gif?itemid=8538975' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/c90691308b84296e6006a8e90bb1761d/tenor.gif?itemid=3531019' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/0dc565e823e7cb1bfacac708210d2fa6/tenor.gif?itemid=5159695 ' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/4af4edc9455631f8b8edcf1e5172b63c/tenor.gif?itemid=5356709' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/c83d68aa80c80f36552f9b4e27bc500b/tenor.gif?itemid=3817457' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/3240b08b8c1d722625dfb9e5d73b7b11/tenor.gif?itemid=3535805' }],
    ],
    repliesForNoQuestions: [
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “Speaking = making a sound with your mouth that other people understand.👂 Work hard on your pronunciation! 😉”
` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “If at anytime you want to ask our team a question, just write #team, and we will respond! 👨👩🏾”` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “You need to live a language, not learn it! Try to consume as much of that country’s culture as you can! 📚🗽”` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “Want to hear more about who uses Langroo and what motivates them? 😍 Here are my social media accounts: \nFB 📱: www.facebook.com / langroo\nInstagram 📷: https://www.instagram.com/langroobot/\nTwitter 🐦: https://twitter.com/Langroobot` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “The reason we learn languages is to be able to talk in specific scenarios! 👋 Make a list of those scenarios now ✏️, and start building the phrases that you need!”` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “People like you are having online classes with some of our amazing English tutors! 💻 If you want to join them, write EXPLORE TUTORS”` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “Fluency won\'t be achieved if you don\'t do the work! 🔨 Start making rules for your learning, e.g. every morning I learn one verb!” ☝️` }],
      [{ type: 'text', content: `I’m more focused on delivering the quiz 📝 at the moment ${senderName}, but here is a piece of advice: “Learn phrases first, grammar second” 😘` }],
    ],
    gifsForNoQuestions: [
      [{ type: 'image', content: 'https://media1.tenor.com/images/aa6cbc40dc7ee1ee670800002bf535e7/tenor.gif?itemid=4712528' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/6fbb8ea8381b75a8c82eb23a8eb63510/tenor.gif?itemid=3531701' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/e872c230a23c8279010ce97d52046e5f/tenor.gif?itemid=10182983' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/29636e769e31497c5161d821562c1d0c/tenor.gif?itemid=5593007' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/5ca6a1973afdac5a4d53e77c17b3d90d/tenor.gif?itemid=5110385' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/9d21ce92e62d950ae8a660c3f1b9691f/tenor.gif?itemid=5608071' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/841aeb9f113999616d097b414c539dfd/tenor.gif?itemid=5368357' }],
      [{ type: 'image', content: 'https://media1.tenor.com/images/6851ef825d2211b47a8f4eed577d29db/tenor.gif?itemid=5218205' }],
    ],
    surveyReplies: [
      {
        type: 'quickReplies',
        content: {
          title: `Hey ${senderName}, I need you to click a button below ;), would you like to improve me?" :D`,
          buttons: [
            { title: 'Let\'s do it!', value: 'continue_survey_flow' },
            { title: 'No', value: 'user_will_not_do_survey' },
          ],
        },
      },
      {
        type: 'quickReplies',
        content: {
          title: `${senderName}, I am extremely good at teaching 😁, but for actual conversation, I am still learning ✏! Would you like to help me improve? 🙏`,
          buttons: [
            { title: 'Of Course', value: 'start_survey_flow_now' },
            { title: 'Why Not', value: 'start_survey_flow_now' },
            { title: 'No', value: 'user_will_not_do_survey' },
          ],
        },
      },
      { type: 'text', content: 'Excellent my friend 😁👌, the more you help me the more I will help you in the future 🙌' },
      { type: 'text', content: 'I promise that I will not make a lot of questions ✌' },
      {
        type: 'quickReplies',
        content: {
          title: 'Do we start?',
          buttons: [
            { title: 'Let\'s do it!', value: 'start_survey_flow_now' },
          ],
        },
      },
    ],
    wontDoSurvey: [
      { type: 'text', content: 'Oww, 😟. Well it\'s ok. If you change your mind later, just write down "I want to improve roo" and I we will talk of how can you help me be the best of the best 💫!' },
    ],
    alreadyDidSurvey: [
      [{ type: 'text', content: 'I love your spirit 💞! Since you already did my survey, you can write down "Help" and tell my bosses how they can make me better 🌟' }],
      [{ type: 'text', content: 'Thanks a lot 🙏, but you already completed my survey ✅. Write "Help" and then tell my bosses what you think can be improved' }],
      [{ type: 'text', content: `${senderName} you're the best❗ Since you already completed my survey, just say "Help" and write down what you think I can do better 💪` }],
      [{ type: 'text', content: 'There are great people, and above them all, there\'s you 🌞. Now that you completed my survey 📝, what you can do is say "Help" and write your thoughts of how I can be the best for you!' }],
      [{ type: 'text', content: `You do me a great honor 😌 ${senderName}. You already did my survey but if you write "Help" you can tell my superiors how I can become the best of the best!` }],
    ],
    dailyStory: [
      { type: 'text', content: 'Great!, please give me a few seconds to load it 😁⏳' },
      { type: 'text', content: '⌚' },
      { type: 'video', content: 'https://s3.amazonaws.com/langroo/videos/video_of_the_day.mp4' },
      { type: 'text', content: `Enjoy today's video ${senderName} 💥` },
    ],
    finishedReply: [
      { type: 'text', content: 'Finished! I hope you enjoyed it 😉☝' },
      { type: 'text', content: 'Good, good 👍' },
    ],
    noVideoBeforeIntro: [
      { type: 'text', content: `Ow, you can watch my daily story in a few seconds ⌚ ${senderName}, let's get you started on a course first! 🎓` },
    ],
  }

  return replies[replyName]
}

module.exports = replyChooser

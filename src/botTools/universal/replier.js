async function replier(messageToSend, dialogue, userFromDB, senderId) {
  // -- Import of general tools and functions
  const BotTools = require('..');
  const FbAPIClass = BotTools.FacebookAPI;
  const { textToAudio } = BotTools.universal;

  // -- Create instances of tools
  const FacebookAPI = new FbAPIClass(senderId);

  // -- Define the function awaiting time
  const awaitingTime = ms => new Promise(resolve => setTimeout(resolve, ms));

  // -- Define the size of the array
  const dialogueSize = dialogue.length;

  if (dialogue[messageToSend] !== undefined) {
    let ms = Math.min(100 * dialogue[messageToSend].content.length, 6000);
    if (dialogue[messageToSend].type === 'picture') {
      ms = 3000;
    }
    if (dialogue[messageToSend].type === 'quickReplies' || dialogue[messageToSend].type === 'buttons') {
      ms = 4500;
    }
    if (dialogue[messageToSend].type === 'delay') {
      await awaitingTime(dialogue[messageToSend].content);
      dialogue.splice(messageToSend, 1);
    }
    if (dialogue[messageToSend].type === 'audio') {
      let userLang;
      if (userFromDB.data) {
        userLang = userFromDB.data.language;
      } else {
        userLang = 'en_US';
      }
      if (userLang === 'en_US' || userLang === 'en_GB') {
        ms = 4000;
        const audio = await textToAudio(dialogue[messageToSend].content, senderId);
        dialogue[messageToSend] = Object.assign({}, dialogue[messageToSend], { content: audio });
      } else {
        dialogue.splice(messageToSend, 1);
      }
    }
    if (process.env.messageDelay === 'off') {
      ms = 0;
    }
    if (messageToSend < dialogueSize) {
      await FacebookAPI.TypingDots(1, senderId);
      await awaitingTime(ms);
      await FacebookAPI.TypingDots(0, senderId);
      await FacebookAPI.SendMessages(dialogue[messageToSend].type, dialogue[messageToSend].content)
        .then(async () => {
          // -- Recursive call of the function adding +1 to the message array counter
          // -- CHANGE PARAMETERS HERE TOO IF THEY CHANGE IN THE MAIN FUNCTION
          await replier(messageToSend + 1, dialogue, userFromDB, senderId);
        })
        .catch((err) => {
          console.error('Error at replier :: ', err);
        });
    }
  }
  return true;
}

module.exports.replier = replier;

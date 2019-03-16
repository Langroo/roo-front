const replyChooser = (replyName, senderName) => {
  const replies = {
    lostInConversation: [
      [{ type: 'text', content: `Well ${senderName}, we took a detour on our conversation, but let's go back to it` }],
      [{ type: 'text', content: 'It makes me happy ☺ to see you exploring my other options. Now, as I was saying...' }],
      [{ type: 'text', content: 'Now that you explored another conversation with me, we should go back to the previous one...' }],
    ],
    pressAButton: [
      [{ type: 'text', content: `Well ${senderName}, to continue I need you to press a button below 👇` }],
      [{ type: 'text', content: 'Sorry, but in this particular case, I need you to press a button 🙏' }],
      [{ type: 'text', content: 'Press a button, to continue you must! 😉' }],
    ],
  };

  return replies[replyName];
};

module.exports = replyChooser;

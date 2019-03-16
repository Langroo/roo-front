const replyChooser = (replyName, senderName) => {
  const replies = {
    lostInConversation: [
      [{ type: 'text', content: `I know we got lost in conversation ${senderName}, but...` }],
      [{ type: 'text', content: '😁 well, that was refreshing! Let\'s go back to our conversation' }],
      [{ type: 'text', content: 'Quick question ⚡, quick answer 🎯, now as I was saying...' }],
    ],
  };

  return replies[replyName];
};

module.exports = replyChooser;

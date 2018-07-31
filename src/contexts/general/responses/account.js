const replyChooser = (replyName, senderName, wildcard) => {
  if (!wildcard.userAccent) {
    wildcard.userAccent = '⁉️'
    console.error('ERROR - THE USER ACCENT WAS SET TO UNDEFINED FOR EXISTING USER')
  }
  if (!wildcard.userLevel) {
    wildcard.userLevel = '⁉️'
    console.error('ERROR - THE USER LEVEL WAS SET TO UNDEFINED FOR EXISTING USER')
  }
  if (!wildcard.userProduct) {
    wildcard.userProduct = '⁉️'
    console.error('ERROR - THE USER PRODUCT WAS SET TO UNDEFINED FOR EXISTING USER')
  }
  if (!wildcard.userSubscriptionStatus) {
    wildcard.userSubscriptionStatus = '⁉️'
    console.error('ERROR - THE USER STATUS WAS SET TO UNDEFINED FOR EXISTING USER')
  }
  const replies = {
    userProfileUpgradeable: [
      {
        type: 'button',
        content:
        {
          title: `Here's the records I have for you ${senderName} 😉📜: \n✌ Our First Message: ${wildcard.subscriptionDate}  \n✌ Preferred Accent: ${wildcard.userAccent.toUpperCase()} \n✌ Chosen Level: ${wildcard.userLevel.toUpperCase()} \n✌ Your Plan: ${wildcard.userProduct.toUpperCase()}\n✌ Your Status: ${wildcard.userSubscriptionStatus.toUpperCase()}`,
          buttons: [
              { title: 'Upgrade Plan', type: 'postback', value: 'upgrade subscription' },
              { title: 'Change Level/Accent', type: 'postback', value: 'change_level_or_accent' },
              { title: 'Delete Account', type: 'postback', value: 'delete_account_init' },
          ],
        },
      },
    ],
    userProfileTop: [
      {
        type: 'button',
        content:
        {
          title: `Here's the records I have for you ${senderName} 😉📜: \n✌ Our First Message: ${wildcard.subscriptionDate} \n✌ Preferred Accent: ${wildcard.userAccent.toUpperCase()} \n✌ Chosen Level: ${wildcard.userLevel.toUpperCase()} \n✌ Your Plan: ${wildcard.userProduct.toUpperCase()}\n✌ Your Status: ${wildcard.userSubscriptionStatus.toUpperCase()}`,
          buttons: [
              { title: 'Change Level/Accent', type: 'postback', value: 'change_level_or_accent' },
              { title: 'Help', type: 'postback', value: 'custom_user_req' },
              { title: 'Delete Account', type: 'postback', value: 'delete_account_init' },
          ],
        },
      },
    ],
  }

  return replies[replyName]
}

module.exports = replyChooser

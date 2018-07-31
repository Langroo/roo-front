/**
 * Global dependencies
 */
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
require('dotenv').config()

/**
 * Local depencencies
 */
const generateHash = (str) => crypto.createHash('md5').update(str).digest('hex');

/**
 * Post
 * API or other services sends request to send a message to the user
 * @param conversation_id
 * @param sender_id
 */
router.post('/:senderId', async function(req, res){
  try {
    let senderId = req.params.senderId
    if (!senderId) {
      throw new Error("ERROR :: Missing parameters in request at MessageTrigger")
    }
  } catch (reason) {
    console.error("ERROR processing message :: ", reason)
  }
})

module.exports = router
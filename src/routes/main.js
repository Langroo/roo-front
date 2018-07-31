/**
 * Global dependencies
 */
const express = require('express')
const router = express.Router()
const bot = require('../bot')
require('dotenv').config()

/**
 * Post
 * The AlMighty Bot :: ROO
 * @param conversation_id
 * @param sender_id
 */
router.post('/', (req, res) => {
  const theBot = new bot(req, res)
  theBot.reply()
})

/**
 * GET
 * Check if everything works correctly
 */
router.get('/', (request, response) => {
  response.status(200)
  return response.render('home', {
    apiUrl: process.env.API_BASE_URL,
  })
})

module.exports = router

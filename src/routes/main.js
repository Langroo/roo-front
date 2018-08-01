/**
 * Global dependencies
 */
const express = require('express')
const router = express.Router()
const frontReceiver = require('../front.receiver')
require('dotenv').config()

// -- Facebook Webhook Handler
router.post('/', (req, res) => {
  frontReceiver.interact(req, res)
  res.end(JSON.stringify({ status: 'ok' }))
})

router.get('/', (req, res) => {
  frontReceiver.verify(req, res)
  res.end(JSON.stringify({ status: 'ok' }))
})

// -- Show the administration page
router.get('/main', (request, response) => {
  response.status(200)
  return response.render('home', {
    apiUrl: process.env.API_BASE_URL,
  })
})

module.exports = router
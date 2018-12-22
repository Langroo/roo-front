/**
 * Global dependencies
 */
const express = require('express');
const router = express.Router();
const url = require('url');
const qs = require('querystring');
const frontReceiver = require('../director');
require('dotenv').config();

// -- Facebook Webhook Handler
router.post('/', (req, res) => {
  frontReceiver.interact(req, res);
  res.end(JSON.stringify({ status: 'ok' }));
});

router.get('/', (req, res) => {
  const query = qs.parse(url.parse(req.url).query);

  if (!query['hub.verify_token']) {
    return res.render('home', {
      apiUrl: process.env.API_BASE_URL,
    });
  }
  frontReceiver.verify(req, res);
  res.end(JSON.stringify({ status: 'ok' }));
});

// -- Show the administration page
router.get('/main', (request, response) => {
  response.status(200);
  return response.render('home', {
    apiUrl: process.env.API_BASE_URL,
  });
});

module.exports = router;

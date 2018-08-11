const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const hbs = require('express-handlebars')
const FacebookAPI = require('./bot-tools').FacebookAPI
const Redis = require('./persistence/redis/connect')
const Bluebird = require('bluebird')
const axios = require('axios')
global.Promise = Bluebird
require('dotenv').load()

Promise.all([Redis])
.then(async () => {

  // load persistent menu
  if (process.env.UPDATE_FACEBOOK_MENU === 'true' || process.env.UPDATE_FACEBOOK_MENU === '1') {
    await FacebookAPI.PersistentMenu()
  }

  // Start Express server
  const app = express()
  app.set('port', process.env.PORT || 5000)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  app.use(cookieParser())

  // Setup of views engine
  app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views', 'layouts') }))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'hbs')

  // Routes management
  const routes = require('./routes')
  app.use('/', routes.main)
  app.use('/messageTrigger', routes.messagesTrigger)

  // -- Roo Webhook
  app.post('/webhook', async (request, response) => {
    // -- Prepare variables
    const event = request.body.event
    const payload = request.body.payload

    try {
      // -- Check variables integrity
      if (event === null || event === undefined || event.length <= 0) { throw new Error('Event is not defined') }
      if (!['paymentSubscriptionFinished'].includes(event)) { throw new Error('Event is not valid') }

      switch (event) {
      case 'paymentSubscriptionFinished':
        console.log('--------------- PAYMENT FINISHED -------------------')
        console.log('Plan target :: ', payload.plan)
        console.log('Payment subscription status :: ', payload.status)
        console.log('----------------------------------------------------')
        break
      default:
        throw new Error('Event not parsed properly')
      }

      // -- Return response
      response.status(200)
      response.statusMessage = 'success calling webhook'
      return response.json({
        statusMessage: response.statusMessage,
        statusCode: response.statusCode,
        data: null,
      })
    } catch (reason) {
      console.log('Webhook was not properly call')

      // -- return response
      response.status(500)
      response.statusMessage = 'error calling webhook'
      return response.json({
        statusMessage: response.statusMessage,
        statusCode: response.statusCode,
        data: null,
      })
    }

  })

  // Run Express server, on right port
  app.listen(app.get('port'), () => {
    console.log('Roo running on port', app.get('port'))
  })
})
.catch(err => {
  if (process.env.NODE_ENV === 'production') {
    try {
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: process.env.DEPLOYMENT_INFO_SLACK_URL,
        method: 'post',
        data: '{"text":"*EMERGENCY! THE BOT IN PRODUCTION IS DOWN, I REPEAT, THE BOT IN PRODUCTION IS DOWN! RUN AND FIX IT QUICKLY, WE ARE LOSING MONEY!*"}',
      })
    } catch (dafuq) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending the notification to SLACK :: ', dafuq)
    }
  } else if (process.env.NODE_ENV === 'quality') {
    try {
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: process.env.DEPLOYMENT_INFO_SLACK_URL,
        method: 'post',
        data: '{"text":"*ALERT --> Bot in QA (Reactor AI) is DOWN - DevOps, time to haul ass and fix it!*"}',
      })
    } catch (dafuq) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending the notification to SLACK :: ', dafuq)
    }
  } else if (process.env.NODE_ENV === 'develop') {
    try {
      axios.request({
        headers: { 'Content-Type': 'application/json' },
        url: process.env.DEPLOYMENT_INFO_SLACK_URL,
        method: 'post',
        data: '{"text":"*ALERT --> Bot in develop (The Great Berenguer) is DOWN.*"}',
      })
    } catch (dafuq) {
      console.log('(╯°□°）╯︵ ┻━┻ ERROR sending the notification to SLACK :: ', dafuq)
    }
  }
  console.error('❌ GRAVE ERROR ❌ - Bot initialization failed', err)
})

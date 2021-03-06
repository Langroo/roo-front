const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const hbs = require('express-handlebars');
const FacebookAPI = require('./botTools').FacebookAPI;
const Redis = require('./redis/connect');
require('dotenv').load();

Promise.all([Redis])
  .then(async () => {
    // load persistent menu
    if (process.env.UPDATE_FACEBOOK_MENU === 'true' || process.env.UPDATE_FACEBOOK_MENU === '1') {
      await FacebookAPI.PersistentMenu();
    }

    // Start Express server
    const app = express();
    app.set('port', process.env.PORT || 5000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(cookieParser());

    // Setup of views engine
    app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views', 'layouts') }));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    // Routes management
    const routes = require('./routes');
    app.use('/', routes.main);

    // -- Roo Webhook
    app.post('/webhook', async (request, response) => {
    // -- Prepare variables
      const event = request.body.event;
      const payload = request.body.payload;

      try {
      // -- Check variables integrity
        if (event === null || event === undefined || event.length <= 0) { throw new Error('Event is not defined'); }
        if (!['paymentSubscriptionFinished'].includes(event)) { throw new Error('Event is not valid'); }

        switch (event) {
          case 'paymentSubscriptionFinished':
            console.log('--------------- PAYMENT FINISHED -------------------');
            console.log('Plan target :: ', payload.plan);
            console.log('Payment subscription status :: ', payload.status);
            console.log('----------------------------------------------------');
            break;
          default:
            throw new Error('Event not parsed properly');
        }

        // -- Return response
        response.status(200);
        response.statusMessage = 'success calling webhook';
        return response.json({
          statusMessage: response.statusMessage,
          statusCode: response.statusCode,
          data: null,
        });
      } catch (reason) {
        console.log('Webhook was not properly call');

        // -- return response
        response.status(500);
        response.statusMessage = 'error calling webhook';
        return response.json({
          statusMessage: response.statusMessage,
          statusCode: response.statusCode,
          data: null,
        });
      }
    });

    // Run Express server, on right port
    app.listen(app.get('port'), () => {
      console.log('Roo running on port', app.get('port'));
    });
  })
  .catch((err) => {
    console.error('❌ GRAVE ERROR ❌ - Bot initialization failed', err);
  });

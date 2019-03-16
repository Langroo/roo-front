/* lint:disable */
/**
 * GLOBAL Dependencies
 */
const Redis = require('redis');
require('dotenv').config();

/**
 * Start DB Connection
 */
module.exports = new Promise((resolve, reject) => {
  // -- Create Redis Client if not exist
  if (process.env.REDIS_CONNECTION) {
    resolve(process.env.REDIS_CONNECTION);
  }

  const redisPort = process.env.REDIS_PORT;
  const redisHost = process.env.REDIS_HOST;
  const redisPsw = process.env.REDIS_PASSWORD;

  if (!redisPort || !redisHost || !redisPsw) {
    console.error('[X] Error at redis connection, the client variables could not be initialized, check your environment variables.');
  }

  const client = Redis.createClient(redisPort, redisHost, {
    password: redisPsw,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    },
  });

  // -- Listen events
  client.on('ready', () => {
    process.env.REDIS_CONNECTION = client;
    resolve(client);
  });

  client.on('error', (error) => {
    reject(error);
  });
});

/**
 * Export the facebook functions
 */
module.exports = {
  FacebookAPI: require('./facebook').FacebookAPI,
  OneForAll: require('./universal').OneForAll,
  BotCache: require('./memory').BotCache,
};

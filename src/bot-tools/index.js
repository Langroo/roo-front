/**
 * Export the facebook functions
 */
module.exports = {
  FacebookAPI: require('./facebook').FacebookAPI,
  ChatBaseAPI: require('./chatbase').functions,
  OneForAll: require('./universal').OneForAll,
  BotCache: require('./memory').BotCache,
}

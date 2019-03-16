const redis = require('./connect');

module.exports = {
  /**
   * hmset to store a user hash
   */
  async hashSetUser(userHash, key, value) {
    try {
      return await (await redis).hset(`user:${userHash}`, key, value);
    } catch (error) {
      console.log('An error occurred :: ', error);
    }
  },

  /**
   * hdel user
   */
  async hashDelUser(userHash) {
    try {
      await (await redis).del(`user:${userHash}`);
      return true;
    } catch (error) {
      console.log('An error occurred :: ', error);
    }
  },

  /**
   * Get all the hash keys
   */
  async hashGetUser(userHash) {
    return new Promise(async (resolve, reject) => {
      try {
        (await redis).hgetall(`user:${userHash}`, (error, user) => {
          if (error) { reject(error); return; }
          resolve(user);
        });
      } catch (error) {
        console.log('An error ocurred :: ', error);
        reject(error);
      }
    });
  },

  async hashGetEveryone(userHash) {
    return new Promise(async (resolve, reject) => {
      try {
        (await redis).hgetall(`user:${userHash}`, (error, user) => {
          if (error) { reject(error); return; }
          resolve(user);
        });
      } catch (error) {
        console.log('An error ocurred :: ', error);
        reject(error);
      }
    });
  },
};

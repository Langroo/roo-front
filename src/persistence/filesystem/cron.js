/**
 * ======================================================
 * =========== Save conversations to mongodb ============
 * ======================================================
 */

 /**
  * Global dependencies
  */
const fs = require('fs')
const axios = require('axios')
const mkdirp = require('mkdirp')
require('dotenv').config()

/**
 * Constants
 */
const basePath = './conversation_logs'

/**
 * Class definition
 */
class FileSystem {

	/**
	 * ===========================================================
	 * Read folder method
	 * Takes a directory and it reads everything inside
	 * @param {String} directory
	 * ===========================================================
	 */
  static async readDirectory (directory) {
    return new Promise((resolve, reject) => {
				// -- Check varibles integrity
      if (!directory) { return reject('{directory} parameter is missing') }
      if (typeof directory !== 'string') { return reject('{directory} parameter must be an String instance') }

				// -- Read directory
      fs.readdir(directory, (error, fileNames) => {
        if (error) {
          console.info('No conversation logs directory found.')
          mkdirp('conversation_logs', () => { console.log('Whoops! Could not create directory for conversations') })
          return resolve(fileNames)
        }
        console.error('Error details :: ', error)
        return resolve(fileNames)
      })
    })
  }

	/**
	 * ==========================================================
	 * Read single file method
	 * It takes a single file and read the entire contain
	 * @param {String} baseDirectory
	 * @param {String} fileName
	 * ==========================================================
	 */
  static async readFile (baseDirectory, fileName) {
    return new Promise((resolve, reject) => {
      // -- Check variables integrity
      if (!baseDirectory) { return reject('{baseDirectory} paramater is missing') }
      if (!fileName) { return reject('{fileName} parameter is missing') }
      if (typeof baseDirectory !== 'string') { return reject('{baseDirectory} parameter must be an String instance') }
      if (typeof fileName !== 'string') { return reject('{fileName} parameter must be an String instance') }

      // -- Read file
      const fileDir = `${baseDirectory}/${fileName}`
      fs.readFile(fileDir, 'utf8', (error, data) => {
        if (error) {
          console.error('Could not read the file specified [%s].', fileName)
          console.error('Error details :: ', error)
          return reject(error)
        }
        resolve(data)
      })
    })
  }

	/**
	 * ==========================================================
	 * Delete single file method
	 * It takes a single file and read the entire contain
	 * @param {String} baseDirectory
	 * @param {String} fileName
	 * ==========================================================
	 */
  static async deleteFile (baseDirectory, fileName) {
    return new Promise((resolve, reject) => {
				// -- Check variables integrity
      if (!baseDirectory) { return reject('{baseDirectory} paramater is missing') }
      if (!fileName) { return reject('{fileName} parameter is missing') }
      if (typeof baseDirectory !== 'string') { return reject('{baseDirectory} parameter must be an String instance') }
      if (typeof fileName !== 'string') { return reject('{fileName} parameter must be an String instance') }

				// -- Delete File
      const fileDir = `${baseDirectory}/${fileName}`
      fs.stat(fileDir, (error) => {

        if (error) {
          console.error('Could not delete the file specified [%s].', fileName)
          console.error('Error details :: ', error)
          return reject(error)
        }

        fs.unlink(fileDir, () => {
          if (error) {
            console.error('Could not delete the file specified [%s].', fileName)
            console.error('Error details :: ', error)
            return reject(error)
          }
          resolve('file deleted successfully')
        })
			 })
    })
  }

	/**
	 * ===========================================================
	 * Migrate files to data base and drop them all
	 * ===========================================================
	 */
  static async toDatabase () {
		// -- Retrieve data from files
    console.log('-------------- FILES TO MONGO --------------')
    console.log('Updating events data...')

		// -- Query every file
		// -- Apply format
		// -- Save on DB using the API
    try {
      const filesData = await Promise.all(
				(await FileSystem.readDirectory(basePath))
				.map((fileName) => FileSystem.readFile(basePath, fileName))
			)

      const events = [].concat.apply([], filesData.map(event => event.split('\n')))
        .filter(event => event !== '')
        .map(event => {
          event = event.split(';;')
          return {
            senderId: event[0],
            rawInput: event[2],
            isPostback: event[3] === 'true',
            date: new Date(parseInt(event[4])),
          }
        })

      console.log('============================================')
      console.log('============== Files saving ================')
      console.log('============================================')
      const response = (await axios.request({
        url: '/events/daily',
        method: 'post',
        baseURL: process.env.API_BASE_URL,
        data: {
          dataSet: events,
        },
      })).data
      console.log('API Response :: ', response)

      console.log('============================================')
      console.log('============== Files delete ================')
      console.log('============================================')
      await Promise.all(
				(await FileSystem.readDirectory(basePath))
				.map((fileName) => FileSystem.deleteFile(basePath, fileName))
			)
      console.log('======== Files deleted succesfully =========')

			// -- CALL API and pass data
      console.log('Everything saved in database!')
      console.log('-------------------------------------------\n')
    	} catch (reason) {
      console.error('An error occurred while retrieving and saving events data...')
      if (reason.message) { console.error('Details :: ', reason.message) } else { console.error('Details :: ', reason) }
      console.log('-------------------------------------------\n')
      return false
    	}
  	}
}

/**
 * All cron tasks
 */
module.exports = FileSystem

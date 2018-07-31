/**
 * Dependencies
 */
const scheduler = require('node-schedule')
const Cron = require('./cron')


/**
 * Cron Jobs run function
 */
async function run () {
    //-- Save files (events) in mongo
    console.log("----------- CRONJOB INFORMATION -----------")
    await Cron.toDatabase()

    scheduler.scheduleJob("events-mongo-cronjob", "0 */2 * * *", async function(){
        try {
            console.log("----------- CRONJOB INFORMATION -----------")
            await Cron.toDatabase()
            console.log("-------------------------------------------\n")
        } catch (reason) {
            console.log("Error in cronjob task...")
            console.log("Details :: ", reason.message)
        }
    })

    console.log("-------------------------------------------\n")
}

module.exports = require('./management')
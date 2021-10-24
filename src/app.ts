
const cron = require('node-cron');
const config = require('../config/app.json');

const CRON_SCHEDULE: string = config.cron_schedule;

class Watchdog {
  start() {
    cron.schedule(CRON_SCHEDULE, () => {
      console.log('Scheduled');
    });
  }
}

new Watchdog().start();
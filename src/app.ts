import { sendWebhookMessage } from './_utils/discord-webhook';

const cron = require('node-cron');
const ping = require('ping');
const config = require('../config/app.json');

const CRON_SCHEDULE: string = config.cron_schedule;

class Watchdog {
  start() {
    cron.schedule(CRON_SCHEDULE, () => {
      config.hosts.forEach((host: string) => {
        ping.sys.probe(host, (isAlive: boolean) => {
          if (!isAlive) {
            sendWebhookMessage('Server Status', `${host} is down!`)
          }
        });
      });
    });
  }
}

new Watchdog().start();
import { sendWebhookMessage } from './_utils/discord-webhook';

const cron = require('node-cron');
const ping = require('ping');
const config = require('../config/app.json');

const CRON_SCHEDULE: string = config.cron_schedule;
const pingCfg = config.ping_cfg;

class Watchdog {

  private downedHosts: string[] = [];

  start() {
    cron.schedule(CRON_SCHEDULE, () => {
      config.hosts.forEach((host: string) => {
        ping.sys.probe(host, (isAlive: boolean) => {
          if (isAlive && this.downedHosts.includes(host)) {
            sendWebhookMessage('Server Status', `${host} is up again!`);
            this.downedHosts.splice(this.downedHosts.indexOf(host), 1);
          } else if (!isAlive && !this.downedHosts.includes(host)) {
            this.downedHosts.push(host);
            sendWebhookMessage('Server Status', `${host} is down!`);
          }
        }, pingCfg);
      });
    });
  }
}

new Watchdog().start();
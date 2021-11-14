import { HostInstance } from './_models/host-instance';
import { sendWebhookMessage } from './_utils/discord-webhook';

const ping = require('ping');
const config = require('../config/app.json');

const PING_CYCLE_TIME: number = config.ping_cycle_time;
const pingCfg = config.ping_cfg;

class Watchdog {

  private hostInstances: HostInstance[] = [];

  start() {
    this.setupHosts();
    this.runCycle();
  }

  private runCycle(): void {
    setInterval(() => {
      console.log(`Pinging ${this.hostInstances.length} hosts`);
      this.hostInstances.forEach((hostInstance) => {
        // Pings the server
        console.log(`Pinged ${hostInstance.host}`);
        ping.sys.probe(hostInstance.host, (isAlive: boolean) => {
          // If the server is up and is already marked as down
          if (isAlive && hostInstance.down) {
            sendWebhookMessage('Server Status', `${hostInstance.host} is up again!`);
            hostInstance.down = false;
            // If the server is down and we have not marked it yet
          } else if (!isAlive && !hostInstance.down) {
            // Check if it has been marked x times
            if (hostInstance.marks < 3) {
              hostInstance.marks++;
            } else if (hostInstance.marks === 3) {
              sendWebhookMessage('Server Status', `${hostInstance.host} is down!`);
              hostInstance.down = true;
            }
            // If the server is just up we reset the marks
          } else if (isAlive) {
            hostInstance.marks = 0;
          }
        }, pingCfg);
      });
    }, PING_CYCLE_TIME * 1000);
  }

  private setupHosts(): void {
    config.hosts.forEach((host: string) => {
      this.hostInstances.push({
        host,
        down: false,
        marks: 0
      });
    });
    console.log(`Successfully set up ${this.hostInstances.length} hosts`);
  }
}

new Watchdog().start();
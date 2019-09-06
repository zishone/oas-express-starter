import debug = require('debug');
import { appConfig } from '../config';

export class Logger {
  private component?: string;

  constructor(filename: string) {
    debug.enable(`*${appConfig.name}:${appConfig.logLevel}*`);
    this.component = filename.split('.')[0].split('/').pop();
  }

  public debug(formatter: any, ...args: any[]) {
    debug(`${new Date().toISOString()} ${appConfig.name}:debug:${this.component}:`)(formatter, ...args);
  }

  public info(formatter: any, ...args: any[]) {
    debug(`${new Date().toISOString()} ${appConfig.name}:info:${this.component}:`)(formatter, ...args);
  }

  public warn(formatter: any, ...args: any[]) {
    debug(`${new Date().toISOString()} ${appConfig.name}:warn:${this.component}:`)(formatter, ...args);
  }

  public error(formatter: any, ...args: any[]) {
    debug(`${new Date().toISOString()} ${appConfig.name}:error:${this.component}:`)(formatter, ...args);
  }
}

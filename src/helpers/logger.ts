import debug = require('debug');
import {
  appConfig,
  loggerConfig,
} from '../config';

export class Logger {
  private filename: string;

  constructor(private component: string, filename: string) {
    debug.enable(`*${appConfig.name}:${loggerConfig.level}*`);
    this.filename = filename.split('.')[0].split('/').pop() || '';
  }

  public info(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:info:${new Date().toISOString()}:`)(formatter, ...args);
  }

  public warn(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:warn:${new Date().toISOString()}:`)(formatter, ...args);
  }

  public error(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:error:${new Date().toISOString()}:`)(formatter, ...args);
  }

  public begun(functionName: string, ...args: any[]) {
    this.info(`${this.component}.${this.filename}.${functionName}.begun %O`, ...args);
  }

  public succeeded(functionName: string, ...args: any[]) {
    this.info(`${this.component}.${this.filename}.${functionName}.succeeded %O`, ...args);
  }

  public failed(functionName: string, ...args: any[]) {
    this.info(`${this.component}.${this.filename}.${functionName}.failed %O`, ...args);
    this.error(`${this.component}.${this.filename}.${functionName}.failed %O`, ...args);
  }
}

import debug = require('debug');
import {
  appConfig,
  loggerConfig,
} from '../config';

export class Logger {
  private filename: string;

  constructor(private compnent: string, filename: string) {
    debug.enable(`*${appConfig.name}:${loggerConfig.level}*`);
    this.filename = filename.split('.')[0].split('/').pop() || '';
  }

  public begun(functionName: string, ...args: any[]) {
    debug(`${appConfig.name}:info:${new Date().toISOString()}`)(`${this.compnent}.${this.filename}.${functionName}.begun %O`, ...args);
  }

  public failed(functionName: string, ...args: any[]) {
    debug(`${appConfig.name}:info:${new Date().toISOString()}`)(`${this.compnent}.${this.filename}.${functionName}.failed %O`, ...args);
    debug(`${appConfig.name}:error:${new Date().toISOString()}`)(`${this.compnent}.${this.filename}.${functionName}.failed %O`, ...args);
  }
}

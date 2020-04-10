import debug = require('debug');
import { appConfig } from '../config';

export class Logger {
  private filename: string;

  constructor(private component: string, filename: string) {
    this.filename = filename.split('.')[0].split('/').pop() || '';
  }

  public info(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:info:`)(formatter, ...args);
  }

  public warn(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:warn:`)(formatter, ...args);
  }

  public error(formatter: any, ...args: any[]) {
    debug(`${appConfig.name}:error:`)(formatter, ...args);
  }

  public begun(requestId: string, functionName: string, ...args: any[]) {
    this.info(` [${requestId}] ${this.component}.${this.filename}.${functionName}.begun %O`, ...args);
  }

  public succeeded(requestId: string, functionName: string, ...args: any[]) {
    this.info(` [${requestId}] ${this.component}.${this.filename}.${functionName}.succeeded %O`, ...args);
  }

  public failed(requestId: string, functionName: string, ...args: any[]) {
    this.info(` [${requestId}] ${this.component}.${this.filename}.${functionName}.failed %O`, ...args);
    this.warn(` [${requestId}] ${this.component}.${this.filename}.${functionName}.failed %O`, ...args);
  }

  public errored(requestId: string, functionName: string, ...args: any[]) {
    this.info(` [${requestId}] ${this.component}.${this.filename}.${functionName}.errored %O`, ...args);
    this.error(` [${requestId}] ${this.component}.${this.filename}.${functionName}.errored %O`, ...args);
  }
}

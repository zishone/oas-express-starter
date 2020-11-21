import debug = require('debug');
import { STATES } from '../constants';
import { config } from '../config';

// TODO: Improve logging by using winston
export class Logger {
  private filename: string;
  private component: string;

  constructor(component: string, filename: string) {
    this.component = component;
    this.filename = filename.split('.')[0].split('/').pop() || '';
  }

  public debug(reqId: string, functionName: string, state: string, arg?: any) {
    debug(`${config.APP_NAME}:debug:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${state} %O`, arg);
  }

  public info(reqId: string, functionName: string, state: string, arg?: any) {
    this.debug(reqId, functionName, state, arg);
    debug(`${config.APP_NAME}:info:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${state} %o`, arg);
  }

  public warn(reqId: string, functionName: string, arg?: any) {
    this.debug(reqId, functionName, STATES.WARNED, arg);
    debug(`${config.APP_NAME}:warn:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${STATES.WARNED} %O`, arg);
  }

  public error(reqId: string, functionName: string, arg?: any) {
    this.debug(reqId, functionName, STATES.FAILED, arg);
    debug(`${config.APP_NAME}:error:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${STATES.FAILED} %O`, arg);
  }

  public fatal(reqId: string, functionName: string, arg: any) {
    this.debug(reqId, functionName, STATES.ERRORED, arg);
    debug(`${config.APP_NAME}:fatal:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${STATES.ERRORED} %O`, arg);
  }
}

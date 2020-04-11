import debug = require('debug');

export class Logger {
  private filename: string;
  private appName: string;

  constructor(private component: string, filename: string) {
    this.filename = filename.split('.')[0].split('/').pop() || '';
    this.appName = require('../../package.json').name;
  }

  public debug(reqId: string, functionName: string, state: string, arg?: any) {
    debug(`${this.appName}:debug:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${state} %O`, arg);
  }

  public info(reqId: string, functionName: string, state: string, arg?: any) {
    this.debug(reqId, functionName, state, arg);
    debug(`${this.appName}:info:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.${state} %o`, arg?.message ? arg.message : arg);
  }

  public error(reqId: string, functionName: string, arg?: any) {
    this.info(reqId, functionName, 'failed', arg);
    debug(`${this.appName}:error:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.failed %O`, arg);
  }

  public fatal(reqId: string, functionName: string, arg: any) {
    this.info(reqId, functionName, 'errored', arg);
    debug(`${this.appName}:fatal:`)(`[${reqId}] ${this.component}.${this.filename}.${functionName}.errored %O`, arg);
  }
}

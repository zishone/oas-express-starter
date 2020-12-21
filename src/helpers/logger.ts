import { ENVIRONMENTS } from '../constants';
import { config } from '../config';
import { ensureDirSync } from 'fs-extra';
import winston from 'winston';

export class Logger {
  private logger: winston.Logger;
  private stream: any;

  constructor() {
    ensureDirSync('logs');
    const transports = [
      new winston.transports.File({
        level: 'info',
        filename: '../logs/info.log',
        handleExceptions: true,
        format: winston.format.json(),
      }),
      new winston.transports.File({
        level: 'error',
        filename: '../logs/error.log',
        handleExceptions: true,
        format: winston.format.json(),
      }),
      new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        format: winston.format.json(),
      }),
      new winston.transports.Console({
        level: 'error',
        handleExceptions: true,
        format: winston.format.json(),
      }),
    ];

    if (config.ENV === ENVIRONMENTS.DEVELOPMENT) {
      transports.push(new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.json(),
      }));
    }

    this.logger = winston.createLogger({
      defaultMeta: { service: config.APP_NAME },
      transports,
    });
    this.stream = {
      write: (message: string, _encoding: string) => {
        this.logger.info(message);
      },
    };
  }

  public getLogStream() {
    return this.stream;
  }

  public info(message: string, args: any) {
    this.logger.info(message, args);
  }

  public debug(message: string, args: any) {
    this.logger.debug(message, args);
  }

  public error(message: string, args: any) {
    this.logger.error(message, args);
  }

  public logSucceeded(reqId: string, invoker: string, args: any = {}): void {
    this.logger.debug(`[${reqId || 'has-no-reqid'}] ${invoker}.succeeded %o`, {
      reqId,
      invoker,
      ...args,
    });
  }

  public logFailed(reqId: string, invoker: string, args: any = {}): void {
    this.logger.debug(`[${reqId || 'has-no-reqid'}] ${invoker}.failed %o`, {
      reqId,
      invoker,
      ...args,
    });
  }

  public logErrored(reqId: string, invoker: string, args: any = {}): void {
    this.logger.debug(`[${reqId || 'has-no-reqid'}] ${invoker}.errored %o`, {
      reqId,
      invoker,
      ...args,
    });
  }
}

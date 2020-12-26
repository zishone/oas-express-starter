import { LOG_LEVELS } from '../constants';
import { config } from '../config';
import { dotnotate } from '@zishone/dotnotate';
import winston from 'winston';

export class Logger {
  private transports: winston.transport[];
  private defualtMeta: { service: string; version: string };
  private logger: winston.Logger;

  constructor() {
    this.defualtMeta = {
      service: config.APP_NAME,
      version: config.APP_VERSION,
    };
    this.transports = [
      new winston.transports.File({
        filename: `./.data/logs/${LOG_LEVELS.INFO}.log`,
        level: LOG_LEVELS.INFO,
      }),
      new winston.transports.File({
        filename: `./.data/logs/${LOG_LEVELS.ERROR}.log`,
        level: LOG_LEVELS.ERROR,
      }),
    ];
    this.logger = winston.createLogger({
      defaultMeta: this.defualtMeta,
      transports: this.transports,
    });
  }

  public enableInfo(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.INFO }));
  }

  public enableDebug(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.DEBUG }));
  }

  public info(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.INFO, message, dotnotate(args));
  }

  public error(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.ERROR, message, dotnotate(args));
  }

  public debug(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.DEBUG, message, dotnotate(args));
  }

  public debugFunction(functionName: string, functionArguments: any, args: any = {}): void {
    this.debug('Function called', {
      'function.name': functionName,
      'function.arguments': Object.values(functionArguments),
      ...args,
    });
  }
}

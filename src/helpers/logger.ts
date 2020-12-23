import { LOG_LEVELS } from '../constants';
import { config } from '../config';
import { ensureDirSync } from 'fs-extra';
import winston from 'winston';

export class Logger {
  private transports: winston.transport[];
  private defualtMeta: { service: string, version: string };
  private logger: winston.Logger;

  constructor() {
    ensureDirSync('logs');
    this.defualtMeta = {
      service: config.APP_NAME,
      version: config.APP_VERSION,
    };
    this.transports = [
      new winston.transports.File({
        filename: `../logs/${LOG_LEVELS.INFO}.log`,
        level: LOG_LEVELS.INFO,
      }),
      new winston.transports.File({
        filename: `../logs/${LOG_LEVELS.ERROR}.log`,
        level: LOG_LEVELS.ERROR,
      }),
      new winston.transports.File({
        filename: `../logs/${LOG_LEVELS.DEBUG}.log`,
        level: 'debug',
      }),
    ];
    this.logger = winston.createLogger({
      defaultMeta: this.defualtMeta,
      transports: this.transports,
    });
  }

  public enableInfo(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.INFO }) );
  }

  public enableDebug(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.DEBUG }));
  }

  public info(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.INFO, message, args);
  }

  public error(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.ERROR, message, args);
  }

  public debug(message: string, args?: { [key: string]: any }): void {
    this.logger.log(LOG_LEVELS.DEBUG, message, args);
  }
}

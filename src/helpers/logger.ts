import { envConfig, pkgConfig } from '../configs';
import { LOG_LEVELS } from '../constants';
import { createWriteStream } from 'fs';
import { dotnotate } from '@zishone/dotnotate';
import winston from 'winston';

export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      defaultMeta: {
        service: pkgConfig.APP_NAME,
        version: pkgConfig.APP_VERSION,
        env: envConfig.ENV,
        hostname: envConfig.HOSTNAME,
      },
    });
    this.logger.add(new winston.transports.Stream({ stream: createWriteStream('/dev/null') }));
  }

  public enableInfo(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.INFO }));
  }

  public enableDebug(): void {
    this.logger.add(new winston.transports.Console({ level: LOG_LEVELS.DEBUG }));
  }

  public enableInfoFile(options?: winston.transports.FileTransportOptions): void {
    this.logger.add(
      new winston.transports.File({
        ...options,
        level: LOG_LEVELS.INFO,
        filename: options?.filename || `./.data/logs/${LOG_LEVELS.INFO}.log`,
      }),
    );
  }

  public enableErrorFile(options?: winston.transports.FileTransportOptions): void {
    this.logger.add(
      new winston.transports.File({
        ...options,
        level: LOG_LEVELS.ERROR,
        filename: options?.filename || `./.data/logs/${LOG_LEVELS.ERROR}.log`,
      }),
    );
  }

  public info(message: string, args: { [key: string]: any } = {}): void {
    this.logger.log(
      LOG_LEVELS.INFO,
      message,
      dotnotate({
        ...args,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  public error(message: string, args: { [key: string]: any } = {}): void {
    this.logger.log(
      LOG_LEVELS.ERROR,
      message,
      dotnotate({
        ...args,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  public debug(message: string, args: { [key: string]: any } = {}): void {
    this.logger.log(
      LOG_LEVELS.DEBUG,
      message,
      dotnotate({
        ...args,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  /*
   * write function for morgan
   */
  public write(log: string): void {
    try {
      const [args, info, error] = JSON.parse(log);
      if (Object.keys(error).length > 0) {
        this.error('Request failed', {
          ...args,
          ...info,
          error,
        });
      } else {
        this.info('Request finished', {
          ...args,
          ...info,
        });
      }
    } catch (error) {
      this.error('Log failed', error);
    }
  }

  public debugFunctionCall(functionName: string, functionArguments: any, args: any = {}): void {
    this.debug('Function called', {
      'function.name': functionName,
      'function.arguments': Object.values(functionArguments),
      ...args,
    });
  }
}

export const logger = new Logger();

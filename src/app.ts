import { Application, Request, json, urlencoded } from 'express';
import { Logger, log } from '@zishone/logan';
import { Mongo, Socket } from './helpers';
import { Server, createServer } from 'http';
import {
  emitterMiddleware,
  errorMiddleware,
  mongoMiddleware,
  passportMiddleware,
  requestIdMiddleware,
} from './middlewares';
import { EventEmitter } from 'events';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { initialize } from 'express-openapi';
import { jsend } from '@zishone/jasenda';
import { mquery } from '@zishone/monique';
import { notificationListener } from './listeners';
import passport from 'passport';
import { spec } from './openapi';

export class App {
  private app: Application;
  private emitter: EventEmitter;
  private logger: Logger;
  private mongo: Mongo;
  private server: Server;
  private socket: Socket;

  constructor(app: Application, logger: Logger, mongo: Mongo) {
    this.app = app;
    this.logger = logger;
    this.mongo = mongo;
    this.server = createServer(this.app);
  }

  public async configure() {
    await this.createEmitters();
    await this.composeMiddlewares();
    await this.commenceListeners();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async createEmitters(): Promise<void> {
    this.emitter = new EventEmitter();
    this.socket = new Socket(this.logger, this.server, this.mongo);
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(requestIdMiddleware());
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(emitterMiddleware(this.emitter));
    this.app.use(log(this.logger));
    this.app.use(jsend());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(mquery());
    this.app.use(passport.initialize());
  }

  private async commenceListeners(): Promise<void> {
    notificationListener(this.logger, this.emitter, this.socket);
  }

  private async constructOas(): Promise<void> {
    initialize({
      app: this.app,
      apiDoc: spec,
      operations: controllers,
      exposeApiDocs: false,
      validateApiDoc: true,
      securityHandlers: {
        loginAuth: async (req: Request): Promise<boolean> => {
          return await new Promise((resolve, reject): void => {
            passportMiddleware(this.logger, this.mongo)(req, req.res, (error: any): void => {
              if (error) {
                reject(error);
              } else {
                resolve(true);
              }
            });
          });
        },
      },
      errorMiddleware: errorMiddleware(),
    });
  }
}

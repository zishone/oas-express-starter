import { Application, Request, json, urlencoded } from 'express';
import { Logger, log } from '@zishone/logan';
import { Mongo, Socket } from './helpers';
import { Server, createServer } from 'http';
import {
  errorMiddleware,
  mongoMiddleware,
  passportMiddleware,
  requestIdMiddleware,
  socketMiddleware,
} from './middlewares';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { initialize } from 'express-openapi';
import { jsend } from '@zishone/jasenda';
import { mquery } from '@zishone/monique';
import passport from 'passport';
import { spec } from './openapi';

export class App {
  private app: Application;
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

  public async configure(): Promise<void> {
    await this.createSocket();
    await this.composeMiddlewares();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async createSocket(): Promise<void> {
    this.socket = new Socket(this.logger, this.server, this.mongo);
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(requestIdMiddleware());
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(socketMiddleware(this.socket));
    this.app.use(log(this.logger));
    this.app.use(jsend());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(mquery());
    this.app.use(passport.initialize());
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

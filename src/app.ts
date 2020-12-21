import {
  ActivityModel,
  UserModel,
} from './models';
import {
  Application,
  Request,
  json,
  urlencoded,
} from 'express';
import {
  Logger,
  Mongo,
} from './helpers';
import {
  Server,
  createServer,
} from 'http';
import {
  emitterMiddleware,
  errorMiddleware,
  jsendMiddleware,
  loggerMiddleware,
  mongoMiddleware,
  mqueryMiddleware,
  passportMiddleware,
  requestIdMiddleware,
} from './middlewares';
import { EventEmitter } from 'events';
import { activitySubscriber } from './subscribers';
import { config } from './config';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { initialize } from 'express-openapi';
import passport from 'passport';
import { spec } from './openapi';

export class App {
  private app: Application;
  private emitter: EventEmitter;
  private logger: Logger;
  private mongo: Mongo;
  private server: Server;

  constructor(logger: Logger, app: Application) {
    this.logger = logger;
    this.app = app;
    this.server = createServer(this.app);
  }

  public async configure() {
    await this.connectMongo();
    await this.concentrateSubscribers();
    await this.composeMiddlewares();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(requestIdMiddleware());
    this.app.use(loggerMiddleware(this.logger));
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(emitterMiddleware(this.emitter));
    this.app.use(jsendMiddleware());
    this.app.use(passport.initialize());
    this.app.use(mqueryMiddleware());
    this.app.use(errorMiddleware());
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
            passportMiddleware(new UserModel(this.logger, this.mongo))(req, req.res, (error: any): void => {
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

  private async connectMongo(): Promise<void> {
    this.mongo = new Mongo(config.DB_URI, config.DB_NAME);
  }

  private async concentrateSubscribers(): Promise<void> {
    this.emitter = new EventEmitter();
    activitySubscriber(this.logger, this.emitter, new ActivityModel(this.logger, this.mongo));
  }
}

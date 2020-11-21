import {
  Application,
  json,
  urlencoded,
} from 'express';
import {
  Server,
  createServer,
} from 'http';
import {
  emmiterMiddleware,
  errorMiddleware,
  jsendMiddleware,
  mongoMiddleware,
  mqueryMiddleware,
  passportMiddleware,
  requestIdMiddleware,
} from './middlewares';
import { EventEmitter } from 'events';
import { Mongo } from './helpers';
import cookieParser = require('cookie-parser');
import cors = require('cors');
import { activitySubscriber } from './subscribers';
import { config } from './config';
import { controllers } from './controllers';
import { initialize } from 'express-openapi';
import passport = require('passport');
import { spec } from './openapi';

export class App {
  private mongo!: Mongo;
  private server: Server;
  private emmiter!: EventEmitter;
  private app: Application;

  constructor(app: Application) {
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
    this.app.use(requestIdMiddleware());
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors({
      origin: config.CORS_ORIGIN,
      methods: config.CORS_METHODS,
      credentials: config.CORS_CREDENTIALS,
    }));
    this.app.use(jsendMiddleware());
    this.app.use(passport.initialize());
    this.app.use(emmiterMiddleware(this.emmiter));
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
        loginAuth: async (req: any): Promise<boolean> => {
          return await new Promise((resolve, reject) => {
            passportMiddleware(this.mongo)(req, req.res, (error: any) => {
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
    this.emmiter = new EventEmitter();
    activitySubscriber(this.mongo, this.emmiter);
  }
}

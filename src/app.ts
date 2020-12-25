import { Application, Request, json, urlencoded } from 'express';
import { Logger, Mongo } from './helpers';
import { Server, createServer } from 'http';
import {
  errorMiddleware,
  jsendMiddleware,
  loggerMiddleware,
  mongoMiddleware,
  mqueryMiddleware,
  passportMiddleware,
  requestIdMiddleware,
} from './middlewares';
import { UserModel } from './models';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { initialize } from 'express-openapi';
import passport from 'passport';
import { spec } from './openapi';

export class App {
  private app: Application;
  private logger: Logger;
  private mongo: Mongo;
  private server: Server;

  constructor(logger: Logger, mongo: Mongo, app: Application) {
    this.logger = logger;
    this.mongo = mongo;
    this.app = app;
    this.server = createServer(this.app);
  }

  public async configure() {
    await this.composeMiddlewares();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(requestIdMiddleware());
    this.app.use(jsendMiddleware());
    this.app.use(loggerMiddleware(this.logger));
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(mqueryMiddleware());
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
            const userModel = new UserModel(this.logger, this.mongo);
            passportMiddleware(userModel)(req, req.res, (error: any): void => {
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

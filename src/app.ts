import { Application, Request, json, urlencoded } from 'express';
import { Server, createServer } from 'http';
import { errorMiddleware, passportMiddleware, requestIdMiddleware } from './middlewares';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { initialize } from 'express-openapi';
import { jsend } from '@zishone/jasenda';
import { log } from '@zishone/logan';
import { logger } from './helpers';
import { mquery } from '@zishone/monique';
import passport from 'passport';
import { spec } from './openapi';

export class App {
  private server: Server;

  constructor(private app: Application) {
    this.server = createServer(this.app);
  }

  public async configure(): Promise<void> {
    await this.composeMiddlewares();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(requestIdMiddleware());
    this.app.use(log(logger));
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
            passportMiddleware()(req, req.res, (error: any): void => {
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

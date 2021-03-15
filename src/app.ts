import { Application, Request, json, urlencoded } from 'express';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { Server, createServer } from 'http';
import { authenticationMiddleware, errorMiddleware, logMiddleware, requestIdMiddleware } from './middlewares';
import { controllers } from './controllers';
import cookieParser from 'cookie-parser';
import { envConfig } from './configs';
import { initialize } from 'express-openapi';
import { jsend } from '@zishone/jasenda';
import { mquery } from '@zishone/monique';
import passport from 'passport';
import { spec } from './openapi';
import { userModel } from './models';

export class App {
  private server: Server;

  constructor(private app: Application) {
    this.server = createServer(this.app);
  }

  public async configure(): Promise<void> {
    await this.configurePassport();
    await this.composeMiddlewares();
    await this.constructOas();
    this.app.emit('ready', this.server);
  }

  private async configurePassport(): Promise<void> {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: envConfig.LOGIN_SECRET,
        },
        async ({ id }: { id: string }, done: VerifiedCallback): Promise<void> => {
          try {
            const user = await userModel.fetchOne({ id });
            done(null, user);
          } catch (error) {
            done(error);
          }
        },
      ),
    );
    passport.serializeUser((user, done): void => {
      done(null, user);
    });
    // passport.deserializeUser((user, done): void => {
    //   done(null, user);
    // });
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(requestIdMiddleware());
    this.app.use(logMiddleware());
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
            authenticationMiddleware()(req, req.res, (error: any): void => {
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

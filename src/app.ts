import cookieParser = require('cookie-parser');
import cors = require('cors');
import {
  Application,
  json,
  urlencoded,
} from 'express';
import { initialize } from 'express-openapi';
import expressRequestId = require('express-request-id');
import morgan = require('morgan');
import passport = require('passport');
import {
  ExtractJwt,
  Strategy,
  VerifiedCallback,
} from 'passport-jwt';
import {
  serve,
  setup,
} from 'swagger-ui-express';
import {
  appConfig,
  authConfig,
  corsConfig,
  loggerConfig,
  mongoConfig,
} from './config';
import { COLLECTIONS } from './constants';
import { controllers } from './controllers';
import { MongoManager } from './helpers';
import {
  jsendMiddleware,
  mongoMiddleware,
} from './middlewares';
import { UserModel } from './models';
import { spec } from './openapi';

export class App {
  private mongo!: MongoManager;

  constructor(private app: Application) {}

  public async configure() {
    await this.connectMongo();
    await this.composeMiddlewares();
    await this.configureOas();
    await this.configurePassport();
    await this.configureMorgan();
    this.app.emit('ready');
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(expressRequestId());
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors(corsConfig));
    this.app.use(passport.initialize());
    this.app.use(jsendMiddleware());
    if (appConfig.env === 'development') {
      this.app.use('/apidocs', serve, setup(spec));
    }
  }

  private async configureOas(): Promise<void> {
    initialize({
      app: this.app,
      apiDoc: spec,
      operations: controllers,
      exposeApiDocs: false,
      validateApiDoc: true,
      securityHandlers: {
        bearerAuth: async (req: any): Promise<boolean> => {
          return await new Promise((resolve, reject) => {
            passport.authenticate('jwt', {session: false}, (error: Error, user: any, _: any): void => {
              try {
                if (error) {
                  throw error;
                } else if (!user) {
                  req.res.jsend.fail({
                    Authorization: 'Authentication failed.',
                  }, 401);
                } else {
                  req.logIn(user, (err: Error) => {
                    if (err) {
                      throw err;
                    } else {
                      resolve(true);
                    }
                  });
                }
              } catch (error) {
                reject(error);
              }
            })(req, req.res, req.next);
          });
        },
      },
    });
  }

  private async configurePassport() {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.bearerSecret,
    };
    const strategy = new Strategy(options, async (payload: any, done: VerifiedCallback) => {
        try {
          const filter = {
            username: payload.username,
          };
          const projection = {
            password: 0,
          };
          const user = await this.mongo.collection(COLLECTIONS.USERS, new UserModel()).findOne(filter, { projection });
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    );
    passport.use(strategy);
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  private async connectMongo(): Promise<void> {
    this.mongo = new MongoManager(mongoConfig);
  }

  private async configureMorgan(): Promise<void> {
    this.app.use(morgan(loggerConfig.morgan.format));
  }
}

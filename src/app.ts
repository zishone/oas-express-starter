import cors = require('cors');
import express = require('express');
import oasTools = require('oas-tools');
import passport = require('passport');
import {
  ExtractJwt,
  Strategy,
  VerifiedCallback,
} from 'passport-jwt';
import {
  authConfig,
  corsConfig,
  mongoConfig,
  oasConfig,
} from './config';
import { COLLECTIONS } from './constants';
import {
  MongoManager,
} from './helpers';
import {
  errorHandlerMiddleware,
  jsendMiddleware,
  mongoMiddleware,
} from './middlewares';
import { UserModel } from './models';
import { spec } from './openapi';

export class App {
  private app: express.Application;
  private mongo!: MongoManager;

  constructor() {
    this.app = express();
  }

  public async initialize() {
    await this.connectMongo();
    await this.composeMiddlewares();
    await this.configureOas();
    await this.configurePassport();
    return this.app;
  }

  private async composeMiddlewares(): Promise<void> {
    this.app.use(mongoMiddleware(this.mongo));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(corsConfig));
    this.app.use(passport.initialize());
    this.app.use(jsendMiddleware());
    this.app.use(errorHandlerMiddleware());
  }

  private async configureOas(): Promise<void> {
    oasTools.configure(oasConfig);
    await new Promise((resolve, reject) => {
      oasTools.initialize(spec, this.app, (error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
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
    try {
      this.mongo = await MongoManager.connect(mongoConfig);
    } catch (error) {
      // TODO: Add loggers and unit tests.
    }
  }
}

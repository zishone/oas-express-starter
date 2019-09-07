import cors = require('cors');
import {
  Application,
  json,
  urlencoded,
} from 'express';
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
  private app: Application;
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
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors(corsConfig));
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
    const strategy = new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: authConfig.secret,
      },
      async (payload: any, done: VerifiedCallback) => {
        try {
          const user = await this.mongo.collection('User', new UserModel()).find({
            username: payload.username,
          });
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    );
    passport.use(strategy);
  }

  private async connectMongo(): Promise<void> {
    try {
      this.mongo = await MongoManager.connect(mongoConfig);
    } catch (error) {
      // TODO: Add loggers and unit tests.
    }
  }
}

import bcrypt = require('bcryptjs');
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt = require('jsonwebtoken');
import { authConfig } from '../config';
import { COLLECTIONS } from '../constants';
import { Logger } from '../helpers';
import { UserModel } from '../models';

const logger = new Logger('controller', __filename);

/**
 * POST /api/v1/auth/register
 * Register
 */
export const registerController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.begun('registerController');
    const newUser = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const filter = {
      username: newUser.username,
    };
    const projection = {
      password: 0,
    };
    const existingUser = await userCollection.findOne(filter, { projection });
    if (existingUser) {
      const data = {
        username: 'User already exists.',
      };
      logger.failed('loginController', data);
      res.jsend.fail(data);
      return;
    }
    const salt = bcrypt.genSaltSync(authConfig.saltRounds);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    newUser.createDate = + new Date();
    await userCollection.insertOne(newUser);
    const user = await userCollection.findOne(filter, { projection });
    res.jsend.success(user);
    logger.succeeded('registerController');
  } catch (error) {
    logger.failed('registerController', error);
    res.jsend.error(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Login
 */
export const loginController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.begun('loginController');
    const credentials = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const filter = {
      username: credentials.username,
    };
    const user = await userCollection.findOne(filter);
    if (!user) {
      const data = {
        username: 'User not found.',
      };
      logger.failed('loginController', data);
      res.jsend.fail(data, 404);
      return;
    }
    const isMatch = bcrypt.compareSync(credentials.password, user.password);
    if (!isMatch) {
      const data = {
        password: 'Password is incorrect.',
      };
      logger.failed('loginController', data);
      res.jsend.fail(data);
      return;
    }
    const payload = {
      username: user.username,
    };
    const bearerToken = jwt.sign(payload, authConfig.bearerSecret, {
      expiresIn: authConfig.bearerTtl,
    });
    const refreshToken = jwt.sign(payload, authConfig.refreshSecret, {
      expiresIn: authConfig.refreshTtl,
    });
    res.jsend.success({
      bearerToken: `Bearer ${bearerToken}`,
      refreshToken: `Refresh ${refreshToken}`,
    });
    logger.succeeded('loginController');
  } catch (error) {
    logger.failed('loginController', error);
    res.jsend.error(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh
 */
export const refreshController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.begun('refreshController');
    const tokens = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const refreshRegex = /^Refresh\s/;
    const refreshPayload: any = jwt.verify(tokens.refreshToken.replace(refreshRegex, ''), authConfig.refreshSecret);
    const filter = {
      username: refreshPayload.username,
    };
    const user = await userCollection.findOne(filter);
    if (!user) {
      const data = {
        refreshToken: 'User not found.',
      };
      logger.failed('refreshController', data);
      res.jsend.fail(data, 404);
      return;
    }
    const payload = {
      username: user.username,
    };
    const bearerToken = jwt.sign(payload, authConfig.bearerSecret, {
      expiresIn: authConfig.bearerTtl,
    });
    const refreshToken = jwt.sign(payload, authConfig.refreshSecret, {
      expiresIn: authConfig.refreshTtl,
    });
    res.jsend.success({
      bearerToken: `Bearer ${bearerToken}`,
      refreshToken: `Refresh ${refreshToken}`,
    });
    logger.succeeded('refreshController');
  } catch (error) {
    logger.failed('refreshController', error);
    res.jsend.error(error);
  }
};

import bcrypt = require('bcryptjs');
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt = require('jsonwebtoken');
import { config } from '../config';
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
    logger.info(req.id, 'registerController', 'begun');
    const newUser = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const filter = { username: newUser.username };
    const projection = { password: 0 };
    const existingUser = await userCollection.findOne(filter, { projection });
    if (existingUser) {
      const data = { username: 'User already exists.' };
      logger.error(req.id, 'registerController', data);
      res.jsend.fail(data);
      return;
    }
    const salt = bcrypt.genSaltSync(config.SALT_ROUNDS);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    newUser.createDate = + new Date();
    await userCollection.insertOne(newUser);
    const user = await userCollection.findOne(filter, { projection });
    res.jsend.success(user);
    logger.info(req.id, 'registerController', 'succeeded');
  } catch (error) {
    logger.fatal(req.id, 'registerController', error);
    res.jsend.error(error.message, 1);
  }
};

/**
 * POST /api/v1/auth/login
 * Login
 */
export const loginController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.info(req.id, 'loginController', 'begun');
    const credentials = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const filter = { username: credentials.username };
    const user = await userCollection.findOne(filter);
    if (!user) {
      const data = { username: 'User not found.' };
      logger.error(req.id, 'loginController', data);
      res.jsend.fail(data);
      return;
    }
    const isMatch = bcrypt.compareSync(credentials.password, user.password);
    if (!isMatch) {
      const data = { password: 'Password is incorrect.' };
      logger.error(req.id, 'loginController', data);
      res.jsend.fail(data);
      return;
    }
    const payload = { username: user.username };
    const bearerToken = jwt.sign(payload, config.BEARER_SECRET, { expiresIn: config.BEARER_TTL });
    const refreshToken = jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: config.REFRESH_TTL });
    res.cookie('refresh', refreshToken);
    res.jsend.success({ bearerToken: `Bearer ${bearerToken}` });
    logger.info(req.id, 'loginController', 'succeeded');
  } catch (error) {
    logger.fatal(req.id, 'loginController', error);
    res.jsend.error(error.message);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh
 */
export const refreshController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.info(req.id, 'refreshController', 'begun');
    const refreshToken = req.cookies['refresh'];
    if (!refreshToken) {
      const data = { refresh: 'Cookie not found.' };
      logger.error(req.id, 'refreshController', data);
      res.jsend.fail(data);
      return;
    }
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const refreshPayload: any = jwt.verify(refreshToken, config.REFRESH_SECRET);
    const filter = { username: refreshPayload.username };
    const user = await userCollection.findOne(filter);
    if (!user) {
      const data = { refreshToken: 'User not found.' };
      logger.error(req.id, 'refreshController', data);
      res.jsend.fail(data);
      return;
    }
    const payload = { username: user.username };
    const bearerToken = jwt.sign(payload, config.BEARER_SECRET, { expiresIn: config.BEARER_TTL });
    const newRefreshToken = jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: config.REFRESH_TTL });
    res.cookie('refresh', newRefreshToken);
    res.jsend.success({ bearerToken: `Bearer ${bearerToken}` });
    logger.info(req.id, 'refreshController', 'succeeded');
  } catch (error) {
    logger.fatal(req.id, 'refreshController', error);
    res.jsend.error(error.message);
  }
};

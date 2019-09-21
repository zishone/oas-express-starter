import bcrypt = require('bcryptjs');
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { authConfig } from '../config';
import { COLLECTIONS } from '../constants';
import { Logger } from '../helpers';
import { UserModel } from '../models';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/auth/users/{username}
 * Get User
 */
export const getUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('getUserController');
    const username = req.params.username;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    if (!user) {
      const data = {
        username: 'User not found.',
      };
      logger.failed('getUserController', data);
      res.jsend.fail(data, 404);
      return;
    }
    res.jsend.success(user);
    logger.succeeded('getUserController');
  } catch (error) {
    logger.failed('getUserController', error);
    res.jsend.error(error);
  }
};

/**
 * PUT /api/v1/auth/users/{username}
 * Update User
 */
export const updateUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('updateUserController');
    const username = req.params.username;
    const update = req.body;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    if (update.password) {
      const salt = bcrypt.genSaltSync(authConfig.saltRounds);
      update.password = bcrypt.hashSync(update.password, salt);
    }
    await userCollection.updateOne({ username }, {
      $set: update,
    });
    const filter = {
      username: update.username || username,
    };
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne(filter, { projection });
    if (!user) {
      const data = {
        username: 'User not found.',
      };
      logger.failed('updateUserController', data);
      res.jsend.fail(data, 404);
      return;
    }
    res.jsend.success(user);
    logger.succeeded('updateUserController');
  } catch (error) {
    logger.failed('updateUserController', error);
    res.jsend.error(error);
  }
};

/**
 * DELETE /api/v1/auth/users/{username}
 * Delete User
 */
export const deleteUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('deleteUserController');
    const username = req.params.username;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    if (!user) {
      const data = {
        username: 'User not found.',
      };
      logger.failed('deleteUserController', data);
      res.jsend.fail(data, 404);
      return;
    }
    await userCollection.deleteOne({ username });
    res.jsend.success(user);
    logger.succeeded('deleteUserController');
  } catch (error) {
    logger.failed('deleteUserController', error);
    res.jsend.error(error);
  }
};

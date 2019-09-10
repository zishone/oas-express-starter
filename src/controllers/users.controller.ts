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
    const username = req.swagger.params.username.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    if (!user) {
      res.jsend.fail({
        username: 'User not found.',
      }, 404);
      return;
    }
    res.jsend.success(user);
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
    const username = req.swagger.params.username.value;
    const update = req.swagger.params.body.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    if (update.password) {
      const salt = bcrypt.genSaltSync(authConfig.saltRounds);
      update.password = bcrypt.hashSync(update.password, salt);
    }
    await userCollection.update({ username }, {
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
      res.jsend.fail({
        username: 'User not found.',
      }, 404);
      return;
    }
    res.jsend.success(user);
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
    const username = req.swagger.params.username.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    if (!user) {
      res.jsend.fail({
        username: 'User not found.',
      }, 404);
      return;
    }
    await userCollection.delete({ username });
    res.jsend.success(user);
  } catch (error) {
    logger.failed('deleteUserController', error);
    res.jsend.error(error);
  }
};

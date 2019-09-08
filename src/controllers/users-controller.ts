import bcrypt = require('bcryptjs');
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { COLLECTIONS } from '../constants';
import { Logger } from '../helpers';
import { UserModel } from '../models';

const logger = new Logger('controller', __filename);

export const getUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('getUserController');
    const username = req.swagger.params.username.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    res.jsend.success(user);
  } catch (error) {
    logger.failed('getUserController', error);
    res.jsend.error(error);
  }
};

export const updateUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('updateUserController');
    const username = req.swagger.params.username.value;
    const update = req.swagger.params.body.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    if (update.password) {
      const salt = bcrypt.genSaltSync(12);
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
    res.jsend.success(user);
  } catch (error) {
    logger.failed('updateUserController', error);
    res.jsend.error(error);
  }
};

export const deleteUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.begun('deleteUserController');
    const username = req.swagger.params.username.value;
    const userCollection = req.mongo.collection(COLLECTIONS.USERS, new UserModel());
    const projection = {
      password: 0,
    };
    const user = await userCollection.findOne({ username }, { projection });
    await userCollection.delete({ username });
    res.jsend.success(user);
  } catch (error) {
    logger.failed('deleteUserController', error);
    res.jsend.error(error);
  }
};

import { MiddlewareChain } from '../helpers';
import { authenticateMiddleware } from '../middlewares';
import {
  loginController,
  refreshController,
  registerController,
} from './auth-controller';
import { healthController } from './health-controller';
import {
  deleteUserController,
  getUserController,
  updateUserController,
} from './users-controller';

export = {
  healthController: new MiddlewareChain(healthController).getHandler(),
  loginController: new MiddlewareChain(loginController).getHandler(),
  refreshController: new MiddlewareChain(refreshController).getHandler(),
  registerController: new MiddlewareChain(registerController).getHandler(),
  deleteUserController: new MiddlewareChain(authenticateMiddleware(), deleteUserController).getHandler(),
  getUserController: new MiddlewareChain(authenticateMiddleware(), getUserController).getHandler(),
  updateUserController: new MiddlewareChain(authenticateMiddleware(), updateUserController).getHandler(),
};

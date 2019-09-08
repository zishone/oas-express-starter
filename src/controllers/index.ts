import { authenticateMiddleware } from '../middlewares';
import { composeMiddlewares } from '../utils/compose-middlewares';
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

module.exports = {
  healthController: composeMiddlewares(healthController),
  loginController: composeMiddlewares(loginController),
  refreshController: composeMiddlewares(refreshController),
  registerController: composeMiddlewares(registerController),
  deleteUserController: composeMiddlewares(authenticateMiddleware(), deleteUserController),
  getUserController: composeMiddlewares(authenticateMiddleware(), getUserController),
  updateUserController: composeMiddlewares(authenticateMiddleware(), updateUserController),
};

import {
  deleteUser,
  getUser,
  putUser,
  putUserPassword,
} from './user/user.controller';
import {
  deleteUserNotesById,
  getUserNotes,
  getUserNotesById,
  postUserNotes,
  putUserNotesById,
} from './user/notes.contoller';
import {
  deleteUsersById,
  getUsers,
  getUsersById,
  putUsersById,
} from './users/users.controller';
import {
  getActivities,
  getActivitiesById,
} from './activities/activities.controller';
import { Chain } from 'chaindler';
import { Handler } from 'express';
import { ROLES } from '../constants';
import { getHealth } from './health/health.controller';
import { postLogin } from './login/login.controller';
import { postRegister } from './register/register.controller';
import { roleMiddleware } from '../middlewares';

export const controllers: { [operation: string]: Handler } = {
  getHealth: new Chain()
    .handle(getHealth),

  postLogin: new Chain()
    .handle(postLogin),

  postRegister: new Chain()
    .handle(postRegister),

  getUser: new Chain()
    .handle(getUser),
  putUser: new Chain()
    .handle(putUser),
  deleteUser: new Chain(roleMiddleware(ROLES.USER))
    .handle(deleteUser),
  putUserPassword: new Chain()
    .handle(putUserPassword),

  postUserNotes: new Chain(roleMiddleware(ROLES.USER))
    .handle(postUserNotes),
  getUserNotes: new Chain(roleMiddleware(ROLES.USER))
    .handle(getUserNotes),
  getUserNotesById: new Chain(roleMiddleware(ROLES.USER))
    .handle(getUserNotesById),
  putUserNotesById: new Chain(roleMiddleware(ROLES.USER))
    .handle(putUserNotesById),
  deleteUserNotesById: new Chain(roleMiddleware(ROLES.USER))
    .handle(deleteUserNotesById),

  getUsers: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getUsers),
  getUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getUsersById),
  putUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(putUsersById),
  deleteUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(deleteUsersById),

  getActivities: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getActivities),
  getActivitiesById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getActivitiesById),
};

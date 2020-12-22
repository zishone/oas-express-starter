import {
  deleteUser,
  getUser,
  patchUser,
  putUserPassword,
} from './user/user.controller';
import {
  deleteUserNotesById,
  getUserNotes,
  getUserNotesById,
  patchUserNotesById,
  postUserNotes,
} from './user/notes.contoller';
import {
  deleteUsersById,
  getUsers,
  getUsersById,
  patchUsersById,
} from './users/users.controller';
import { Chain } from 'chaindler';
import { ROLES } from '../constants';
import { RequestHandler } from 'express';
import { getHealth } from './health/health.controller';
import { postLogin } from './login/login.controller';
import { postRegister } from './register/register.controller';
import { roleMiddleware } from '../middlewares';

export const controllers: { [controllerName: string]: RequestHandler } = {
  getHealth: new Chain()
    .handle(getHealth),

  postRegister: new Chain()
    .handle(postRegister),

  postLogin: new Chain()
    .handle(postLogin),

  getUser: new Chain()
    .handle(getUser),
  patchUser: new Chain()
    .handle(patchUser),
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
  patchUserNotesById: new Chain(roleMiddleware(ROLES.USER))
    .handle(patchUserNotesById),
  deleteUserNotesById: new Chain(roleMiddleware(ROLES.USER))
    .handle(deleteUserNotesById),

  getUsers: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getUsers),
  getUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(getUsersById),
  patchUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(patchUsersById),
  deleteUsersById: new Chain(roleMiddleware(ROLES.ADMIN))
    .handle(deleteUsersById),
};

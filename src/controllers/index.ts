import { deleteUser, getUser, patchUser } from './api/v1/user.controller';
import { deleteUserNotesById, getUserNotesById, patchUserNotesById } from './api/v1/user/notes/note-id.contoller';
import { deleteUsersById, getUsersById, patchUsersById } from './api/v1/users/user-id.controller';
import { getUserNotes, postUserNotes } from './api/v1/user/notes.contoller';
import { Chain } from '@zishone/chaindler';
import { ROLES } from '../constants';
import { RequestHandler } from 'express';
import { getHealth } from './health.controller';
import { getUsers } from './api/v1/users.controller';
import { postLogin } from './api/v1/login.controller';
import { postRegister } from './api/v1/register.controller';
import { putUserPassword } from './api/v1/user/password.controller';
import { roleMiddleware } from '../middlewares';

export const controllers: { [controllerName: string]: RequestHandler } = {
  getHealth: new Chain().handle(getHealth),

  postRegister: new Chain().handle(postRegister),

  postLogin: new Chain().handle(postLogin),

  getUser: new Chain().handle(getUser),
  patchUser: new Chain().handle(patchUser),
  deleteUser: new Chain(roleMiddleware(ROLES.USER)).handle(deleteUser),
  putUserPassword: new Chain().handle(putUserPassword),

  postUserNotes: new Chain(roleMiddleware(ROLES.USER)).handle(postUserNotes),
  getUserNotes: new Chain(roleMiddleware(ROLES.USER)).handle(getUserNotes),
  getUserNotesById: new Chain(roleMiddleware(ROLES.USER)).handle(getUserNotesById),
  patchUserNotesById: new Chain(roleMiddleware(ROLES.USER)).handle(patchUserNotesById),
  deleteUserNotesById: new Chain(roleMiddleware(ROLES.USER)).handle(deleteUserNotesById),

  getUsers: new Chain(roleMiddleware(ROLES.ADMIN)).handle(getUsers),
  getUsersById: new Chain(roleMiddleware(ROLES.ADMIN)).handle(getUsersById),
  patchUsersById: new Chain(roleMiddleware(ROLES.ADMIN)).handle(patchUsersById),
  deleteUsersById: new Chain(roleMiddleware(ROLES.ADMIN)).handle(deleteUsersById),
};

import {
  deleteUserNotesNoteIdV1,
  getUserNotesNoteIdV1,
  patchUserNotesNoteIdV1,
} from './api/v1/user-notes-note-id.contoller';
import { deleteUserV1, getUserV1, patchUserV1 } from './api/v1/user.controller';
import { deleteUsersUserIdV1, getUsersUserIdV1, patchUsersUserIdV1 } from './api/v1/users-user-id.controller';
import { getUserNotesV1, postUserNotesV1 } from './api/v1/user-notes.contoller';
import { roleMiddleware, uploadMiddleware } from '../middlewares';
import { Chain } from '@zishone/chaindler';
import { ROLES } from '../constants';
import { RequestHandler } from 'express';
import { getHealth } from './health.controller';
import { getUserNotesNoteIdExportV1 } from './api/v1/user-notes-note-id-export';
import { getUsersV1 } from './api/v1/users.controller';
import { postLoginV1 } from './api/v1/login.controller';
import { postRegisterV1 } from './api/v1/register.controller';
import { postUserNotesImportV1 } from './api/v1/user-notes-import';
import { putUserPasswordV1 } from './api/v1/user-password.controller';

export const controllers: { [controllerName: string]: RequestHandler } = {
  getHealth: new Chain().handle(getHealth),

  postRegisterV1: new Chain().handle(postRegisterV1),

  postLoginV1: new Chain().handle(postLoginV1),

  getUserV1: new Chain().handle(getUserV1),
  patchUserV1: new Chain().handle(patchUserV1),
  deleteUserV1: new Chain(roleMiddleware(ROLES.USER)).handle(deleteUserV1),
  putUserPasswordV1: new Chain().handle(putUserPasswordV1),

  postUserNotesV1: new Chain(roleMiddleware(ROLES.USER)).handle(postUserNotesV1),
  getUserNotesV1: new Chain(roleMiddleware(ROLES.USER)).handle(getUserNotesV1),
  postUserNotesImportV1: new Chain(roleMiddleware(ROLES.USER), uploadMiddleware('file')).handle(postUserNotesImportV1),
  getUserNotesNoteIdV1: new Chain(roleMiddleware(ROLES.USER)).handle(getUserNotesNoteIdV1),
  patchUserNotesNoteIdV1: new Chain(roleMiddleware(ROLES.USER)).handle(patchUserNotesNoteIdV1),
  deleteUserNotesNoteIdV1: new Chain(roleMiddleware(ROLES.USER)).handle(deleteUserNotesNoteIdV1),
  getUserNotesNoteIdExportV1: new Chain(roleMiddleware(ROLES.USER)).handle(getUserNotesNoteIdExportV1),

  getUsersV1: new Chain(roleMiddleware(ROLES.ADMIN)).handle(getUsersV1),
  getUsersUserIdV1: new Chain(roleMiddleware(ROLES.ADMIN)).handle(getUsersUserIdV1),
  patchUsersUserIdV1: new Chain(roleMiddleware(ROLES.ADMIN)).handle(patchUsersUserIdV1),
  deleteUsersUserIdV1: new Chain(roleMiddleware(ROLES.ADMIN)).handle(deleteUsersUserIdV1),
};

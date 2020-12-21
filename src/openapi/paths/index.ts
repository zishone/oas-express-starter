import * as health from './health/health';
import * as login from './login/login';
import * as register from './register/register';
import * as user from './user/user';
import * as userNotes from './user/notes';
import * as users from './users/users';
import { OpenAPIV3 } from 'openapi-types';

export const paths: OpenAPIV3.PathsObject = {
  '/health': health.health,

  '/api/v1/login': login.login,

  '/api/v1/register': register.register,

  '/api/v1/user': user.user,
  '/api/v1/user/password': user.userPassword,

  '/api/v1/user/notes': userNotes.userNotes,
  '/api/v1/user/notes/{id}': userNotes.userNotesById,

  '/api/v1/users': users.users,
  '/api/v1/users/{id}': users.usersById,
};

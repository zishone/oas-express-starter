import { user, userPassword } from './user/user';
import { userNotes, userNotesById } from './user/notes';
import { users, usersById } from './users/users';
import { OpenAPIV3 } from 'openapi-types';
import { health } from './health/health';
import { login } from './login/login';
import { register } from './register/register';

export const paths: OpenAPIV3.PathsObject = {
  '/health': health,

  '/api/v1/register': register,

  '/api/v1/login': login,

  '/api/v1/user': user,
  '/api/v1/user/password': userPassword,

  '/api/v1/user/notes': userNotes,
  '/api/v1/user/notes/{id}': userNotesById,

  '/api/v1/users': users,
  '/api/v1/users/{id}': usersById,
};

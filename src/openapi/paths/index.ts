import { OpenAPIV3 } from 'openapi-types';
import { health } from './health';
import { login } from './api/v1/login';
import { register } from './api/v1/register';
import { user } from './api/v1/user';
import { userNotes } from './api/v1/user-notes';
import { userNotesById } from './api/v1/user-notes-note-id';
import { userPassword } from './api/v1/user-password';
import { users } from './api/v1/users';
import { usersById } from './api/v1/users-user-id';

export const paths: OpenAPIV3.PathsObject = {
  '/health': health,

  '/api/v1/register': register,

  '/api/v1/login': login,

  '/api/v1/user': user,
  '/api/v1/user/password': userPassword,

  '/api/v1/user/notes': userNotes,
  '/api/v1/user/notes/{noteId}': userNotesById,

  '/api/v1/users': users,
  '/api/v1/users/{userId}': usersById,
};

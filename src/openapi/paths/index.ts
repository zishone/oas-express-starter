import { OpenAPIV3 } from 'openapi-types';
import { health } from './health';
import { loginV1 } from './api/v1/login';
import { registerV1 } from './api/v1/register';
import { userNotesImportV1 } from './api/v1/user-notes-import';
import { userNotesNoteIdExportV1 } from './api/v1/user-notes-note-id-export';
import { userNotesNoteIdV1 } from './api/v1/user-notes-note-id';
import { userNotesV1 } from './api/v1/user-notes';
import { userPasswordV1 } from './api/v1/user-password';
import { userV1 } from './api/v1/user';
import { usersUserIdV1 } from './api/v1/users-user-id';
import { usersV1 } from './api/v1/users';

export const paths: OpenAPIV3.PathsObject = {
  '/health': health,

  '/api/v1/register': registerV1,

  '/api/v1/login': loginV1,

  '/api/v1/user': userV1,
  '/api/v1/user/password': userPasswordV1,

  '/api/v1/user/notes': userNotesV1,
  '/api/v1/user/notes/import': userNotesImportV1,
  '/api/v1/user/notes/{noteId}': userNotesNoteIdV1,
  '/api/v1/user/notes/{noteId}/export': userNotesNoteIdExportV1,

  '/api/v1/users': usersV1,
  '/api/v1/users/{userId}': usersUserIdV1,
};

import { afterEach, beforeEach, describe } from 'mocha';
import { database } from '../../../src/helpers';
import { health } from './health.test';
import { login } from './api/v1/login.test';
import { migrate } from '../../../src/utils';
import { register } from './api/v1/register.test';
import { user } from './api/v1/user.test';
import { userNotes } from './api/v1/user-notes.test';
import { userNotesById } from './api/v1/user-notes-note-id.test';
import { userNotesByIdExport } from './api/v1/user-notes-note-id-export.test';
import { userNotesImport } from './api/v1/user-notes-import.test';
import { userPassword } from './api/v1/user-password.test';
import { users } from './api/v1/users.test';
import { usersById } from './api/v1/users-user-id.test';

describe('routes', (): void => {
  beforeEach(
    async (): Promise<void> => {
      await migrate();
    },
  );

  afterEach(
    async (): Promise<void> => {
      const connection = await database.getConnection();
      await connection.dropDatabase();
    },
  );

  describe('/health', health);

  describe('/api/v1/register', register);

  describe('/api/v1/login', login);

  describe('/api/v1/user', user);
  describe('/api/v1/user/password', userPassword);

  describe('/api/v1/user/notes', userNotes);
  describe('/api/v1/user/notes/import', userNotesImport);
  describe('/api/v1/user/notes/{noteId}', userNotesById);
  describe('/api/v1/user/notes/{noteId}/export', userNotesByIdExport);

  describe('/api/v1/users', users);
  describe('/api/v1/users/{userId}', usersById);
});

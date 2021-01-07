import '../../../src/config';
import { afterEach, beforeEach, describe } from 'mocha';
import { database, logger } from '../../../src/server';
import { user, userPassword } from './user/user.test';
import { userNotes, userNotesById } from './user/notes.test';
import { users, usersById } from './users/users.test';
import chaiHttp from 'chai-http';
import { health } from './health/health.test';
import { login } from './login/login.test';
import { migrate } from '../../../src/utils';
import { register } from './register/register.test';
import { use } from 'chai';

use(chaiHttp);

describe('routes', (): void => {
  beforeEach(
    async (): Promise<void> => {
      await migrate(logger, database);
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
  describe('/api/v1/user/notes/{noteId}', userNotesById);

  describe('/api/v1/users', users);
  describe('/api/v1/users/{userId}', usersById);
});

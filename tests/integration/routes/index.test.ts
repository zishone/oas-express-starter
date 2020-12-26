import '../../../src/config';
import { afterEach, beforeEach, describe } from 'mocha';
import { logger, mongo } from '../../../src/server';
import { user, userPassword } from './user/user.test';
import { health } from './health/health.test';
import { login } from './login/login.test';
import { migrate } from '../../../src/utils';
import { register } from './register/register.test';

describe('routes', (): void => {
  beforeEach(
    async (): Promise<void> => {
      await migrate(logger, mongo);
    },
  );

  afterEach(
    async (): Promise<void> => {
      const db = await mongo.getDb();
      await db.dropDatabase();
    },
  );

  describe('/health', health);

  describe('/api/v1/register', register);

  describe('/api/v1/login', login);

  describe('/api/v1/user', user);
  describe('/api/v1/user/password', userPassword);
});

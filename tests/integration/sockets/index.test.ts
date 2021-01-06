import '../../../src/config';
import { afterEach, beforeEach, describe } from 'mocha';
import { logger, mongo } from '../../../src/server';
import { EVENTS } from '../../../src/constants';
import chaiHttp from 'chai-http';
import { connectError } from './connect-error.test';
import { migrate } from '../../../src/utils';
import { notification } from './notification.test';
import { use } from 'chai';

use(chaiHttp);

describe.only('sockets', (): void => {
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

  describe(EVENTS.NOTIFICATION, notification);
  describe(EVENTS.CONNECT_ERROR, connectError);
});

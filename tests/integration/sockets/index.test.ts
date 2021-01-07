import '../../../src/config';
import { afterEach, beforeEach, describe } from 'mocha';
import { database, logger } from '../../../src/server';
import { EVENTS } from '../../../src/constants';
import chaiHttp from 'chai-http';
import { connect } from './connect.test';
import { connectError } from './connect-error.test';
import { migrate } from '../../../src/utils';
import { use } from 'chai';

use(chaiHttp);

describe('sockets', (): void => {
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

  describe('events', (): void => {
    describe(EVENTS.CONNECT, connect);
    describe(EVENTS.CONNECT_ERROR, connectError);
  });
});

import { before, describe } from 'mocha';
import { health } from './health/health.test';
import { mongo } from '../../../src/server';

describe('routes', (): void => {
  before(
    'before',
    async (): Promise<void> => {
      const retries = 10;
      const connect = async (retry: number = 0): Promise<void> => {
        try {
          await mongo.getDb();
        } catch (_error) {
          if (retry > retries) {
            return;
          }
          // eslint-disable-next-line no-unused-vars
          await connect(retry + 1);
        }
      };
      await connect();
    },
  );

  after(
    'after',
    async (): Promise<void> => {
      const db = await mongo.getDb();
      db.dropDatabase();
    },
  );

  describe('/health', health);
});

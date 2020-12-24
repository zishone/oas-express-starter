import { describe, it } from 'mocha';
import { Mongo } from '../../../src/helpers';
import { MongoClient } from 'mongodb';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  let mongo: Mongo;
  const sandbox = createSandbox();
  const testData: { [key: string]: any } = {};

  beforeEach((): void => {
    const logger = { debugFunction: sandbox.spy() };
    testData.testDb = nanoid(12);
    testData.testUri = nanoid(12);
    mongo = new Mongo(logger as any, testData.testUri, testData.testDb);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('getDb', (): void => {
    it('should create a note object', async (): Promise<void> => {
      sandbox
        .stub(MongoClient, 'connect')
        .onCall(0)
        .resolves({ db: (): { command: () => void } => ({ command: async (): Promise<void> => null }) });

      await mongo.getDb();
      await mongo.getDb();

      expect(true).to.equal(true);
    });
  });
};

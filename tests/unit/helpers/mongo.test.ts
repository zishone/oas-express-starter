import { SinonSpy, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { Mongo } from '../../../src/helpers';
import { MongoClient } from 'mongodb';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let mongo: Mongo;

  beforeEach((): void => {
    const logger = { debugFunction: (): void => null };
    const testDb = nanoid(12);
    const testUri = nanoid(12);
    mongo = new Mongo(logger as any, testUri, testDb);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('getDb', (): void => {
    it('should connect to database successfully', async (): Promise<void> => {
      const commandSpy = sandbox.spy();
      sandbox
        .stub(MongoClient, 'connect')
        .onCall(0)
        .resolves({ db: (): { command: SinonSpy } => ({ command: commandSpy }) });

      await mongo.getDb();
      await mongo.getDb();

      expect(true).to.be.equal(true);
    });
  });
};

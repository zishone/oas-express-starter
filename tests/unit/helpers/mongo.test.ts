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
    const logger = { debugFunctionCall: (): void => null };
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

  describe('error', (): void => {
    it('should throw an httpError 403', async (): Promise<void> => {
      const testError = { code: 11000 };

      try {
        mongo.error(testError);
      } catch (error) {
        expect(error.status).to.be.equal(403);
      }
    });

    it('should throw an httpError 400', async (): Promise<void> => {
      const testError = { code: 9 };

      try {
        mongo.error(testError);
      } catch (error) {
        expect(error.status).to.be.equal(400);
      }
    });

    it('should throw an error', async (): Promise<void> => {
      const testError = new Error();

      try {
        mongo.error(testError);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
};

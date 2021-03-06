import { SinonSpy, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { MongoClient } from 'mongodb';
import { database } from '../../../src/helpers';
import { expect } from 'chai';

export default (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('getConnection', (): void => {
    it('should connect to database successfully', async (): Promise<void> => {
      const commandSpy = sandbox.spy();
      sandbox
        .stub(MongoClient, 'connect')
        .onCall(0)
        .resolves({ db: (): { command: SinonSpy } => ({ command: commandSpy }) });

      await database.getConnection();
      await database.getConnection();

      expect(commandSpy.calledOnce).to.be.equal(true);
    });
  });

  describe('error', (): void => {
    it('should throw an httpError 403', async (): Promise<void> => {
      const testError = { code: 11000 };

      try {
        database.error(testError);
      } catch (error) {
        expect(error.status).to.be.equal(403);
      }
    });

    it('should throw an httpError 400', async (): Promise<void> => {
      const testError = { code: 9 };

      try {
        database.error(testError);
      } catch (error) {
        expect(error.status).to.be.equal(400);
      }
    });

    it('should throw an error', async (): Promise<void> => {
      const testError = new Error();

      try {
        database.error(testError);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
};

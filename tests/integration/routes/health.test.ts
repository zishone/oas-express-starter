import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { Database } from '../../../src/helpers';
import { app } from '../../../src/server';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { use } from 'chai';

use(chaiHttp);

export const health = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const response = await request(app).get('/health');

      expect(response.status).to.be.equal(500);
    });

    it('should respond 500 WHEN database connection check failed', async (): Promise<void> => {
      sandbox.stub(Database.prototype, 'getConnection').onCall(0).rejects();

      const response = await request(app).get('/health');

      expect(response.status).to.be.equal(500);
    });
  });
};

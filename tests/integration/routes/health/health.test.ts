import { describe, it } from 'mocha';
import { expect, request, use } from 'chai';
import { app } from '../../../../src/server';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

use(chaiHttp);

export const health = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200 WHEN service is healthy', async (): Promise<void> => {
      const response = await request(app).get('/health');

      expect(response.status).to.equals(200);
    });

    it('should respond 500 WHEN database connection check failed', async (): Promise<void> => {
      const response = await request(app).get('/health');

      expect(response.status).to.equals(500);
    });
  });
};

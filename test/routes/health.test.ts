import {
  expect,
  request,
  use,
} from 'chai';
import chaiHttp = require('chai-http');
import {
  describe,
  it,
} from 'mocha';
import sinon = require('sinon');
import { MongoManager } from '../../src/helpers';
import { app } from '../../src/server';

use(chaiHttp);

describe('health', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/v1/health', () => {
    it('should return 200', async () => {
      const db: any = {};
      sandbox
        .stub(MongoManager.prototype, 'getDb')
        .returns(Promise.resolve(db));

      const response = await request(app).get('/api/v1/health');

      expect(response.status).to.equals(200);
    });
  });
});

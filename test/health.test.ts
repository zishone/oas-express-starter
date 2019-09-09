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
import { app } from '../src/server';

use(chaiHttp);

describe('health', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).to.equals(200);
    });
  });
});

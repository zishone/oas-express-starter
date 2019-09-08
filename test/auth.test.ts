import {
  expect,
  request,
  use,
} from 'chai';
import chaiHttp = require('chai-http');
import { Application } from 'express';
import {
  describe,
  it,
} from 'mocha';
import { App } from '../src/app';

use(chaiHttp);

const app = new App();

describe('health', () => {
  let server: Application;
  before(async () => {
    server = await app.initialize();
  });

  describe('GET /api/v1/health', () => {
    it('should return 200', async () => {
      const response = await request(server).get('/api/v1/health');
      expect(response.status).to.equals(200);
    });
  });
});

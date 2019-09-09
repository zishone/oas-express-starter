import {
  expect,
  request,
  use,
} from 'chai';
import chaiHttp = require('chai-http');
import felicity = require('felicity');
import {
  afterEach,
  describe,
  it,
} from 'mocha';
import passport = require('passport');
import { createSandbox } from 'sinon';
import { MongoCollection } from '../src/helpers';
import { UserModel } from '../src/models';
import { app } from '../src/server';

use(chaiHttp);

describe('auth', () => {
  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/v1/users/{username}', () => {
    it('should return 200', async () => {
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .returns(Promise.resolve(user));
      sandbox
        .stub(passport, 'authenticate')
        .callsFake((_: string, _1: any, callback: any): any => {
          callback(null, user);
          return () => null;
        });

      const response = await request(app).get(`/api/v1/users/${user.username}`);

      expect(response.status).to.equals(200);
    });
  });

  describe('PUT /api/v1/users/{username}', () => {
    it('should return 200', async () => {
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox.stub(MongoCollection.prototype, 'update');
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .returns(Promise.resolve(user));
      sandbox
        .stub(passport, 'authenticate')
        .callsFake((_: string, _1: any, callback: any): any => {
          callback(null, user);
          return () => null;
        });

      const response = await request(app)
        .put(`/api/v1/users/${user.username}`)
        .send(user);

      expect(response.status).to.equals(200);
    });
  });

  describe('DELETE /api/v1/users/{username}', () => {
    it('should return 200', async () => {
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox.stub(MongoCollection.prototype, 'delete');
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .returns(Promise.resolve(user));
      sandbox
        .stub(passport, 'authenticate')
        .callsFake((_: string, _1: any, callback: any): any => {
          callback(null, user);
          return () => null;
        });

      const response = await request(app)
        .delete(`/api/v1/users/${user.username}`)
        .send(user);

      expect(response.status).to.equals(200);
    });
  });
});

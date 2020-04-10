import bcrypt = require('bcryptjs');
import {
  expect,
  request,
  use,
} from 'chai';
import chaiHttp = require('chai-http');
import felicity = require('felicity');
import jwt = require('jsonwebtoken');
import {
  afterEach,
  describe,
  it,
} from 'mocha';
import sinon = require('sinon');
import { MongoCollection } from '../../src/helpers';
import {
  CredentialsModel,
  NewUserModel,
  TokensModel,
  UserModel,
} from '../../src/models';
import { app } from '../../src/server';

use(chaiHttp);

describe('auth', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/v1/auth/register', () => {
    it('should return 200', async () => {
      sandbox.stub(MongoCollection.prototype, 'insertOne');
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .onCall(0)
        .returns(Promise.resolve(null))
        .onCall(1)
        .returns(Promise.resolve(user));
      const newUser = felicity.example(new NewUserModel().getJoiSchema());

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(response.status).to.equals(200);
    });
  });

  describe('GET /api/v1/auth/login', () => {
    it('should return 200', async () => {
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .returns(Promise.resolve(user));
      sandbox
        .stub(bcrypt, 'compareSync')
        .returns(true);
      const credentials = felicity.example(new CredentialsModel().getJoiSchema());

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(response.status).to.equals(200);
    });
  });

  describe('GET /api/v1/auth/refresh', () => {
    it('should return 200', async () => {
      const user = felicity.example(new UserModel().getJoiSchema());
      sandbox
        .stub(MongoCollection.prototype, 'findOne')
        .returns(Promise.resolve(user));
      sandbox
        .stub(jwt, 'verify')
        .returns(user);
      const tokens = felicity.example(new TokensModel().getJoiSchema());
      sandbox
        .stub(jwt, 'sign')
        .onCall(0)
        .returns(tokens.bearerToken)
        .onCall(1)
        .returns(tokens.refreshToken);

      const response = await request(app)
        .get('/api/v1/auth/refresh')
        .set('Cookie', `refresh=${tokens.refreshToken}`)
        .send();

      expect(response.status).to.equals(200);
    });
  });
});

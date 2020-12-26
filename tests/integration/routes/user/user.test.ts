import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request, use } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import chaiHttp from 'chai-http';
import { config } from '../../../../src/config';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

use(chaiHttp);

export const user = (): void => {
  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${testAccessToken}`).send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 401 WHEN accessToken was not sent', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      await userModel.save(testUser);

      const response = await request(app).get('/api/v1/user').send();

      expect(response.status).to.be.equal(401);
    });
  });

  describe('PATCH', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testNewUsername = nanoid(12);
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 403 WHEN update results in a duplicate', async (): Promise<void> => {
      const testUsers = [
        {
          username: nanoid(12),
          email: nanoid(12),
          password: nanoid(12),
          name: nanoid(12),
          role: ROLES.USER,
          createdOn: Date.now(),
        },
        {
          username: nanoid(12),
          email: nanoid(12),
          password: nanoid(12),
          name: nanoid(12),
          role: ROLES.USER,
          createdOn: Date.now(),
        },
      ];

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUsers);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ username: testUsers[1].username });

      expect(response.status).to.be.equal(403);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testSalt = genSaltSync(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: hashSync(testPassword, testSalt),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ password: testPassword });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 403 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ password: testInvalidPassword });

      expect(response.status).to.be.equal(403);
    });
  });
};

export const userPassword = (): void => {
  describe('PUT', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testNewPassword = nanoid(12);
      const testSalt = genSaltSync(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: hashSync(testPassword, testSalt),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .put('/api/v1/user/password')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({
          currentPassword: testPassword,
          newPassword: testNewPassword,
        });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 403 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid(12);
      const testNewPassword = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .put('/api/v1/user/password')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({
          currentPassword: testInvalidPassword,
          newPassword: testNewPassword,
        });

      expect(response.status).to.be.equal(403);
    });
  });
};

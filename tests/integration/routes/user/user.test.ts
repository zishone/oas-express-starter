import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import { UserService } from '../../../../src/services';
import { config } from '../../../../src/config';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

export const user = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send();

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

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(UserService.prototype, 'fetchUserById').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send();

      expect(response.status).to.be.equal(500);
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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 400 WHEN update is empty', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({});

      expect(response.status).to.be.equal(400);
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
      const [testUserId] = await userModel.save(testUsers);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .put('/api/v1/user/password')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
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
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .put('/api/v1/user/password')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({
          currentPassword: testInvalidPassword,
          newPassword: testNewPassword,
        });

      expect(response.status).to.be.equal(403);
    });
  });
};

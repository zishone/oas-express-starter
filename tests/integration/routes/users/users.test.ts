import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request, use } from 'chai';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import { UserService } from '../../../../src/services';
import chaiHttp from 'chai-http';
import { config } from '../../../../src/config';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

use(chaiHttp);

export const users = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users?filter=username==${testUser.username}&fields=username&sort=createdOn&limit=0&skip=0&page=1`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 200 WHEN sorted asc', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      await userModel.save(testUser);

      const response = await request(app)
        .get(
          `/api/v1/users?filter=username==${testUser.username}&fields=username&sort=createdOn==asc&limit=0&skip=0&page=1`,
        )
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 200 WHEN sorted desc', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      await userModel.save(testUser);

      const response = await request(app)
        .get(
          `/api/v1/users?filter=username==${testUser.username}&fields=username&sort=createdOn==desc&limit=0&skip=0&page=1`,
        )
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 400 WHEN filter is invalid', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      await userModel.save(testUser);

      const response = await request(app)
        .get(
          `/api/v1/users?filter=username=/=${testUser.username}&fields=username&sort=createdOn&limit=0&skip=0&page=1`,
        )
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(400);
    });

    it('should respond 400 WHEN sort is invalid', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      await userModel.save(testUser);

      const response = await request(app)
        .get(
          `/api/v1/users?filter=username==${testUser.username}&fields=username&sort=createdOn==any&limit=0&skip=0&page=1`,
        )
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(400);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(UserService.prototype, 'fetchUsers').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/users?fields=username&sort=createdOn&limit=0&skip=0&page=1')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(500);
    });
  });
};

export const usersById = (): void => {
  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 403 WHEN role is unauthorized', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(403);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testId = nanoid(12);

      const response = await request(app)
        .get(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });

  describe('PATCH', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewUsername = nanoid(12);
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testId] = await userModel.save(testUser);

      const response = await request(app)
        .patch(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewUsername = nanoid(12);
      const testId = nanoid(12);

      const response = await request(app)
        .patch(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(404);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testId] = await userModel.save(testUser);

      const response = await request(app)
        .delete(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.ADMIN,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testId = nanoid(12);

      const response = await request(app)
        .delete(`/api/v1/users/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

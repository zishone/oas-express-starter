import { app, database, logger } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import { UserService } from '../../../../src/services';
import { config } from '../../../../src/config';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
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
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
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
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
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
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(UserService.prototype, 'fetchUsers').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUserId = nanoid(12);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewUsername = nanoid(12);
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .patch(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewUsername = nanoid(12);
      const testUserId = nanoid(12);

      const response = await request(app)
        .patch(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
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
      const userModel = new UserModel(logger, database);
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUserId = nanoid(12);

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

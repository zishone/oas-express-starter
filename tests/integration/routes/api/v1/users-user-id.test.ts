import { User, userModel } from '../../../../../src/models';
import { appConfig, envConfig } from '../../../../../src/configs';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const usersUserId = (): void => {
  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 403 WHEN role is unauthorized', async (): Promise<void> => {
      const testAdmin = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(403);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testUserId = nanoid(appConfig.DATA_ID_LENGTH);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });

  describe('PATCH', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testNewUsername = nanoid();
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .patch(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testNewUsername = nanoid();
      const testUserId = nanoid(appConfig.DATA_ID_LENGTH);

      const response = await request(app)
        .patch(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(404);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, envConfig.LOGIN_SECRET, {
        expiresIn: envConfig.LOGIN_TTL,
      });
      const testUserId = nanoid(appConfig.DATA_ID_LENGTH);

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

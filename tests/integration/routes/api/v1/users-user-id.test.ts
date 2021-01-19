import { User, userModel } from '../../../../../src/models';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const usersUserId = (): void => {
  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 403 WHEN role is unauthorized', async (): Promise<void> => {
      const testAdmin = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(403);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewUsername = nanoid(12);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .patch(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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

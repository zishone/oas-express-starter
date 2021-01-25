import { User, userModel } from '../../../../../src/models';
import { appConfig, envConfig } from '../../../../../src/configs';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../../src/constants';
import { UserService } from '../../../../../src/services';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const user = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 401 WHEN accessToken was not sent', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      await userModel.save(testUser);

      const response = await request(app).get('/api/v1/user').send();

      expect(response.status).to.be.equal(401);
    });

    it('should respond 401 WHEN user does not exist', async (): Promise<void> => {
      const testUserId = nanoid(appConfig.DATA_ID_LENGTH);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send();

      expect(response.status).to.be.equal(401);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

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
      const testNewUsername = nanoid();
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({ username: testNewUsername });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 400 WHEN update is empty', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({});

      expect(response.status).to.be.equal(400);
    });

    it('should respond 403 WHEN update results in a duplicate', async (): Promise<void> => {
      const testUsers = [
        new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid()),
        new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid()),
      ];
      const [testUserId] = await userModel.save(testUsers);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .patch('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({ username: testUsers[1].username });

      expect(response.status).to.be.equal(403);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testPassword = nanoid();
      const testSalt = genSaltSync(appConfig.SALT_ROUNDS);
      const testUser = new User(
        ROLES.USER,
        nanoid(),
        `${nanoid()}@example.com`,
        hashSync(testPassword, testSalt),
        nanoid(),
      );
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({ password: testPassword });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 403 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid();
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      const response = await request(app)
        .delete('/api/v1/user')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({ password: testInvalidPassword });

      expect(response.status).to.be.equal(403);
    });
  });
};

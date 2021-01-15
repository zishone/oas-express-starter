import { User, UserModel } from '../../../../../src/models';
import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import { UserService } from '../../../../../src/services';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const users = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const userModel = new UserModel(logger, database);
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      await userModel.save(testUser);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 200 WHEN sorted asc', async (): Promise<void> => {
      const userModel = new UserModel(logger, database);
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      await userModel.save(testUser);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 200 WHEN sorted desc', async (): Promise<void> => {
      const userModel = new UserModel(logger, database);
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testAdminId] = await userModel.save(testAdmin);
      const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      await userModel.save(testUser);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${testAdminAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const userModel = new UserModel(logger, database);
      const testAdmin = new User(ROLES.ADMIN, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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

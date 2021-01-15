import { User, UserModel } from '../../../../../src/models';
import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../../src/constants';
import chaiHttp from 'chai-http';
import { nanoid } from 'nanoid';
import { use } from 'chai';

use(chaiHttp);

export const login = (): void => {
  describe('POST', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testSalt = genSaltSync(12);
      const userModel = new UserModel(logger, database);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), hashSync(testPassword, testSalt), nanoid(12));
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/login').send({
        login: testUser.username,
        password: testPassword,
      });

      expect(response.status).to.be.equal(200);
    });

    it('should respond 401 WHEN user does not exist', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testUsername = nanoid(12);

      const response = await request(app).post('/api/v1/login').send({
        login: testUsername,
        password: testPassword,
      });

      expect(response.status).to.be.equal(401);
    });

    it('should respond 401 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid(12);
      const userModel = new UserModel(logger, database);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/login').send({
        login: testUser.username,
        password: testInvalidPassword,
      });

      expect(response.status).to.be.equal(401);
    });
  });
};

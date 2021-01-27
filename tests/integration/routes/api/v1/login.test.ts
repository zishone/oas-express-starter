import { User, userModel } from '../../../../../src/models';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import { appConfig } from '../../../../../src/configs';
import chaiHttp from 'chai-http';
import { nanoid } from 'nanoid';
import { use } from 'chai';

use(chaiHttp);

export const login = (): void => {
  describe('POST', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testPassword = nanoid();
      const testSalt = genSaltSync(appConfig.SALT_ROUNDS);
      const testUser = new User(
        ROLES.USER,
        nanoid(),
        `${nanoid()}@example.com`,
        hashSync(testPassword, testSalt),
        nanoid(),
      );
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/login').send({
        login: testUser.username,
        password: testPassword,
      });

      expect(response.status).to.be.equal(200);
    });

    it('should respond 401 WHEN user does not exist', async (): Promise<void> => {
      const testPassword = nanoid();
      const testUsername = nanoid();

      const response = await request(app).post('/api/v1/login').send({
        login: testUsername,
        password: testPassword,
      });

      expect(response.status).to.be.equal(401);
    });

    it('should respond 401 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid();
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/login').send({
        login: testUser.username,
        password: testInvalidPassword,
      });

      expect(response.status).to.be.equal(401);
    });
  });
};

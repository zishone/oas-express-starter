import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import { nanoid } from 'nanoid';

export const login = (): void => {
  describe('POST', (): void => {
    it('should respond 200', async (): Promise<void> => {
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
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/login').send({
        login: testUser.username,
        password: testInvalidPassword,
      });

      expect(response.status).to.be.equal(401);
    });
  });
};

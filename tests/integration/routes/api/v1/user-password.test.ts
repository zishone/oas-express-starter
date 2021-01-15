import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../../src/constants';
import { UserModel } from '../../../../../src/models';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const userPassword = (): void => {
  describe('PUT', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testNewPassword = nanoid(12);
      const testSalt = genSaltSync(12);
      const userModel = new UserModel(logger, database);
      const testUser = userModel.create(
        ROLES.USER,
        nanoid(12),
        nanoid(12),
        hashSync(testPassword, testSalt),
        nanoid(12),
      );
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
      const userModel = new UserModel(logger, database);
      const testUser = userModel.create(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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

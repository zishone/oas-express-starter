import { User, userModel } from '../../../../../src/models';
import { appConfig, envConfig } from '../../../../../src/configs';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const userPassword = (): void => {
  describe('PUT', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testPassword = nanoid();
      const testNewPassword = nanoid();
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
        .put('/api/v1/user/password')
        .set('Authorization', `Bearer ${testUserAccessToken}`)
        .send({
          currentPassword: testPassword,
          newPassword: testNewPassword,
        });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 403 WHEN password is invalid', async (): Promise<void> => {
      const testInvalidPassword = nanoid();
      const testNewPassword = nanoid();
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testUserAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

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

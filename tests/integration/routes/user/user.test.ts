import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request, use } from 'chai';
import { ROLES } from '../../../../src/constants';
import { UserModel } from '../../../../src/models';
import chaiHttp from 'chai-http';
import { config } from '../../../../src/config';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

use(chaiHttp);

export const user = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      const [testId] = await userModel.save(testUser);

      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${testAccessToken}`).send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 401 WHEN accessToken was not sent', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, mongo);
      await userModel.save(testUser);

      const response = await request(app).get('/api/v1/user').send();

      expect(response.status).to.be.equal(401);
    });

    it('should respond 401 WHEN user does not exist', async (): Promise<void> => {
      const testId = nanoid(12);
      const testAccessToken = sign({ id: testId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${testAccessToken}`).send();

      expect(response.status).to.be.equal(401);
    });
  });
};

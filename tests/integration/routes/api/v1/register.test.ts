import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import { UserModel } from '../../../../../src/models';
import chaiHttp from 'chai-http';
import { nanoid } from 'nanoid';
import { use } from 'chai';

use(chaiHttp);

export const register = (): void => {
  describe('POST', (): void => {
    it('should respond 201', async (): Promise<void> => {
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const response = await request(app).post('/api/v1/register').send(testUser);

      expect(response.status).to.be.equal(201);
    });

    it('should respond 403 WHEN user already exists', async (): Promise<void> => {
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      const userModel = new UserModel(logger, database);
      await userModel.save(testUser);

      const response = await request(app).post('/api/v1/register').send(testUser);

      expect(response.status).to.be.equal(403);
    });
  });
};

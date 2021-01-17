import { User, userModel } from '../../../../../src/models';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { NoteService } from '../../../../../src/services';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { createSandbox } from 'sinon';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const userNotesImport = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('POST', (): void => {
    it('should respond 201', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      const response = await request(app)
        .post('/api/v1/user/notes/import')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .attach('file', join('.', 'tests', 'integration', 'support', 'note.csv'), 'note.csv');

      expect(response.status).to.be.equal(201);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(NoteService.prototype, 'createNote').onCall(0).rejects();

      const response = await request(app)
        .post('/api/v1/user/notes/import')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .attach('file', join('.', 'tests', 'integration', 'support', 'note.csv'), 'note.csv');

      expect(response.status).to.be.equal(500);
    });
  });
};

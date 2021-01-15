import { NoteModel, UserModel } from '../../../../../src/models';
import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { NoteService } from '../../../../../src/services';
import { ROLES } from '../../../../../src/constants';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const userNotes = (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('POST', (): void => {
    it('should respond 201', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };

      const response = await request(app)
        .post('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(testNote);

      expect(response.status).to.be.equal(201);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteService.prototype, 'createNote').onCall(0).rejects();

      const response = await request(app)
        .post('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(testNote);

      expect(response.status).to.be.equal(500);
    });
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
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };
      const noteModel = new NoteModel(logger, database);
      await noteModel.save(testNote);

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(NoteService.prototype, 'fetchNotes').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(500);
    });
  });
};

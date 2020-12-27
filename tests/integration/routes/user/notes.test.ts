import { NoteModel, UserModel } from '../../../../src/models';
import { app, logger, mongo } from '../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request, use } from 'chai';
import { NoteService } from '../../../../src/services';
import { ROLES } from '../../../../src/constants';
import chaiHttp from 'chai-http';
import { config } from '../../../../src/config';
import { createSandbox } from 'sinon';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

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
      const userModel = new UserModel(logger, mongo);
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
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteService.prototype, 'createUserNote').onCall(0).rejects();

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
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };
      const noteModel = new NoteModel(logger, mongo);
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
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

      sandbox.stub(NoteService.prototype, 'fetchUserNotes').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(500);
    });
  });
};

export const userNotesById = (): void => {
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
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };
      const noteModel = new NoteModel(logger, mongo);
      const [testId] = await noteModel.save(testNote);

      const response = await request(app)
        .get(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testId = nanoid(12);

      const response = await request(app)
        .get(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });

  describe('PATCH', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewBody = nanoid(12);
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };
      const noteModel = new NoteModel(logger, mongo);
      const [testId] = await noteModel.save(testNote);

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ body: testNewBody });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewBody = nanoid(12);
      const testId = nanoid(12);

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ body: testNewBody });

      expect(response.status).to.be.equal(404);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = {
        userId: testUserId,
        title: nanoid(12),
        body: nanoid(12),
        modifiedOn: Date.now(),
        createdOn: Date.now(),
      };
      const noteModel = new NoteModel(logger, mongo);
      const [testId] = await noteModel.save(testNote);

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN not does not exist', async (): Promise<void> => {
      const testUser = {
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const userModel = new UserModel(logger, mongo);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testId = nanoid(12);

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

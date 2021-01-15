import { NoteModel, UserModel } from '../../../../../src/models';
import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import chaiHttp from 'chai-http';
import { config } from '../../../../../src/configs';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

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
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .get(`/api/v1/user/notes/${testNoteId}`)
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
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNoteId = nanoid(12);

      const response = await request(app)
        .get(`/api/v1/user/notes/${testNoteId}`)
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
      const userModel = new UserModel(logger, database);
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
      const noteModel = new NoteModel(logger, database);
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testNoteId}`)
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
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNewBody = nanoid(12);
      const testNoteId = nanoid(12);

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testNoteId}`)
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
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testNoteId}`)
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
      const userModel = new UserModel(logger, database);
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNoteId = nanoid(12);

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

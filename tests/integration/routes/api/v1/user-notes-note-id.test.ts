import { Note, User, noteModel, userModel } from '../../../../../src/models';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { envConfig } from '../../../../../src/configs';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import { use } from 'chai';

use(chaiHttp);

export const userNotesNoteId = (): void => {
  describe('GET', (): void => {
    it('should respond 200', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(), nanoid());
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .get(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 404 WHEN note does not exist', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNoteId = nanoid();

      const response = await request(app)
        .get(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });

  describe('PATCH', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNewBody = nanoid();
      const testNote = new Note(testUserId, nanoid(), nanoid());
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ body: testNewBody });

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN note does not exist', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNewBody = nanoid();
      const testNoteId = nanoid();

      const response = await request(app)
        .patch(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ body: testNewBody });

      expect(response.status).to.be.equal(404);
    });
  });

  describe('DELETE', (): void => {
    it('should respond 204', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(), nanoid());
      const [testNoteId] = await noteModel.save(testNote);

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(204);
    });

    it('should respond 404 WHEN note does not exist', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNoteId = nanoid();

      const response = await request(app)
        .delete(`/api/v1/user/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(404);
    });
  });
};

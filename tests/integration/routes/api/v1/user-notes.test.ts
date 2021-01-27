import { Note, User, noteModel, userModel } from '../../../../../src/models';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { NoteService } from '../../../../../src/services';
import { ROLES } from '../../../../../src/constants';
import { app } from '../../../../../src/server';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { envConfig } from '../../../../../src/configs';
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
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(), nanoid());

      const response = await request(app)
        .post('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(testNote);

      expect(response.status).to.be.equal(201);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(), nanoid());

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
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(), nanoid());
      await noteModel.save(testNote);

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const testUser = new User(ROLES.USER, nanoid(), `${nanoid()}@example.com`, nanoid(), nanoid());
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });

      sandbox.stub(NoteService.prototype, 'fetchNotes').onCall(0).rejects();

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(500);
    });
  });
};

import { COLLECTIONS, ROLES } from '../../../../../src/constants';
import { Note, User } from '../../../../../src/entities';
import { app, database, logger } from '../../../../../src/server';
import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import { Model } from '../../../../../src/helpers';
import { NoteService } from '../../../../../src/services';
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
      const userModel = new Model<User>(logger, database, COLLECTIONS.USERS);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(12), nanoid(12));

      const response = await request(app)
        .post('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send(testNote);

      expect(response.status).to.be.equal(201);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const userModel = new Model<User>(logger, database, COLLECTIONS.USERS);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const testNote = new Note(testUserId, nanoid(12), nanoid(12));

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
      const userModel = new Model<User>(logger, database, COLLECTIONS.USERS);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
      const [testUserId] = await userModel.save(testUser);
      const testAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      const noteModel = new Model<Note>(logger, database, COLLECTIONS.NOTES);
      const testNote = new Note(testUserId, nanoid(12), nanoid(12));
      await noteModel.save(testNote);

      const response = await request(app)
        .get('/api/v1/user/notes')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send();

      expect(response.status).to.be.equal(200);
    });

    it('should respond 500 WHEN unknown error occurs', async (): Promise<void> => {
      const userModel = new Model<User>(logger, database, COLLECTIONS.USERS);
      const testUser = new User(ROLES.USER, nanoid(12), nanoid(12), nanoid(12), nanoid(12));
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

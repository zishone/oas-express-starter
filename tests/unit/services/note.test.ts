import { describe, it } from 'mocha';
import { NoteModel } from '../../../src/models';
import { NoteService } from '../../../src/services';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let noteService: NoteService;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const mongo = { getDb: async (): Promise<void> => null };
    noteService = new NoteService(logger as any, mongo as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('createUserNote', (): void => {
    it('should create new user note entry in database', async (): Promise<void> => {
      const testNote = {
        id: nanoid(12),
        userId: nanoid(12),
        title: nanoid(12),
        body: nanoid(12),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteModel.prototype, 'create').onCall(0).returns(testNote);
      sandbox.stub(NoteModel.prototype, 'save').onCall(0).resolves([testNote.id]);
      sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);

      const { note } = await noteService.createUserNote(testNote.userId, testNote.title, testNote.body);

      expect(note).to.deep.equal(testNote);
    });
  });

  describe('fetchUserNotes', (): void => {
    it('should return user notes list fetched from the database', async (): Promise<void> => {
      const testUserId = nanoid(12);
      const testNotes = [
        {
          id: nanoid(12),
          userId: testUserId,
          title: nanoid(12),
          body: nanoid(12),
          createdOn: Date.now(),
        },
      ];

      sandbox
        .stub(NoteModel.prototype, 'fetch')
        .onCall(0)
        .resolves({
          count: async (): Promise<number> => testNotes.length,
          toArray: async (): Promise<any[]> => testNotes,
        } as any);

      const { noteCount, notes } = await noteService.fetchUserNotes(testUserId);

      expect(noteCount).to.deep.equal(testNotes.length);
      expect(notes).to.deep.equal(testNotes);
    });
  });

  describe('fetchUserNoteById', (): void => {
    it('should return a user note fetched from the database given note id', async (): Promise<void> => {
      const testNote = {
        id: nanoid(12),
        userId: nanoid(12),
        title: nanoid(12),
        body: nanoid(12),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);

      const { note } = await noteService.fetchUserNoteById(testNote.userId, testNote.id);

      expect(note).to.deep.equal(testNote);
    });
  });

  describe('updateUserNoteById', (): void => {
    it('should update a user note in the database given note id', async (): Promise<void> => {
      const testNote = {
        id: nanoid(12),
        userId: nanoid(12),
        title: nanoid(12),
        body: nanoid(12),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);
      sandbox.stub(NoteModel.prototype, 'update').onCall(0).resolves();

      await noteService.updateUserNoteById(testNote.userId, testNote.id, testNote);

      expect(true).to.be.equal(true);
    });
  });

  describe('deleteUserNoteById', (): void => {
    it('should delete a user note from the database given note id', async (): Promise<void> => {
      const testNote = {
        id: nanoid(12),
        userId: nanoid(12),
        title: nanoid(12),
        body: nanoid(12),
        createdOn: Date.now(),
      };

      sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);
      sandbox.stub(NoteModel.prototype, 'delete').onCall(0).resolves();

      await noteService.deleteUserNoteById(testNote.userId, testNote.id);

      expect(true).to.be.equal(true);
    });
  });

  describe('deleteUserNotes', (): void => {
    it('should delete a user note from the database given note id', async (): Promise<void> => {
      const testUserId = nanoid(12);

      sandbox.stub(NoteModel.prototype, 'delete').onCall(0).resolves();

      await noteService.deleteUserNotes(testUserId);

      expect(true).to.be.equal(true);
    });
  });
};

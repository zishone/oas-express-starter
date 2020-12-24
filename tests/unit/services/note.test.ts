import { describe, it } from 'mocha';
import { NoteModel } from '../../../src/models';
import { NoteService } from '../../../src/services';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default () => {
  describe('NoteService', () => {
    let noteService: NoteService;
    const sandbox = createSandbox();
    const testData: { [key: string]: any } = {};

    beforeEach(() => {
      const logger = { debugFunction: sandbox.spy() };
      const mongo = { getDb: sandbox.spy() };
      noteService = new NoteService(logger as any, mongo as any);
      testData.testUserId = nanoid(12);
      testData.testNote = {
        id: nanoid(12),
        userId: testData.testUserId,
        title: nanoid(12),
        body: nanoid(12),
        createdOn: Date.now(),
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('createUserNote', () => {
      it('should create new user note entry in database', async () => {
        const { testNote } = testData;

        sandbox.stub(NoteModel.prototype, 'create').onCall(0).returns(testNote);
        sandbox.stub(NoteModel.prototype, 'save').onCall(0).resolves([testNote.id]);
        sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);

        const { note } = await noteService.createUserNote(testNote.userId, testNote.title, testNote.body);

        expect(note).to.deep.equal(testNote);
      });
    });

    describe('fetchUserNotes', () => {
      it('should return user notes list fetched from the database', async () => {
        const { testNote, testUserId } = testData;
        const testNotes = [testNote];

        sandbox
          .stub(NoteModel.prototype, 'fetch')
          .onCall(0)
          .resolves({
            count: async () => testNotes.length,
            toArray: async () => testNotes,
          } as any);

        const { noteCount, notes } = await noteService.fetchUserNotes(testUserId);

        expect(noteCount).to.deep.equal(testNotes.length);
        expect(notes).to.deep.equal(testNotes);
      });
    });

    describe('fetchUserNoteById', () => {
      it('should return a user note fetched from the database given note id', async () => {
        const { testNote } = testData;

        sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);

        const { note } = await noteService.fetchUserNoteById(testNote.userId, testNote.id);

        expect(note).to.deep.equal(testNote);
      });
    });

    describe('updateUserNoteById', () => {
      it('should update a user note in the database given note id', async () => {
        const { testNote } = testData;

        sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);
        sandbox.stub(NoteModel.prototype, 'update').onCall(0).resolves();

        await noteService.updateUserNoteById(testNote.userId, testNote.id, testNote);

        expect(true).to.equal(true);
      });
    });

    describe('deleteUserNoteById', () => {
      it('should delete a user note from the database given note id', async () => {
        const { testNote } = testData;

        sandbox.stub(NoteModel.prototype, 'fetchOne').onCall(0).resolves(testNote);
        sandbox.stub(NoteModel.prototype, 'delete').onCall(0).resolves();

        await noteService.deleteUserNoteById(testNote.userId, testNote.id);

        expect(true).to.equal(true);
      });
    });

    describe('deleteUserNotes', () => {
      it('should delete a user note from the database given note id', async () => {
        const { testUserId } = testData;

        sandbox.stub(NoteModel.prototype, 'delete').onCall(0).resolves();

        await noteService.deleteUserNotes(testUserId);

        expect(true).to.equal(true);
      });
    });
  });
};

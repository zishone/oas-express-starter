import { describe, it } from 'mocha';
import { Model } from '../../../src/helpers';
import { Note } from '../../../src/entities';
import { NoteService } from '../../../src/services';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let noteService: NoteService;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const database = { getConnection: async (): Promise<void> => null };
    noteService = new NoteService(logger as any, database as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('createNote', (): void => {
    it('should create new note entry in database', async (): Promise<void> => {
      const testNote = new Note(nanoid(12), nanoid(12), nanoid(12));

      sandbox.stub(Model.prototype, 'save').onCall(0).resolves([testNote.id]);
      sandbox.stub(Model.prototype, 'fetchOne').onCall(0).resolves(testNote);

      const { note } = await noteService.createNote(testNote.userId, testNote.title, testNote.body);

      expect(note).to.deep.equal(testNote);
    });
  });

  describe('fetchNotes', (): void => {
    it('should return notes list fetched from the database', async (): Promise<void> => {
      const testNote = new Note(nanoid(12), nanoid(12), nanoid(12));
      const testNotes = [testNote];

      sandbox
        .stub(Model.prototype, 'fetch')
        .onCall(0)
        .resolves({
          count: async (): Promise<number> => testNotes.length,
          toArray: async (): Promise<any[]> => testNotes,
        } as any);

      const { noteCount, notes } = await noteService.fetchNotes();

      expect(noteCount).to.deep.equal(testNotes.length);
      expect(notes).to.deep.equal(testNotes);
    });
  });

  describe('fetchNoteById', (): void => {
    it('should return a note fetched from the database given note id', async (): Promise<void> => {
      const testNote = new Note(nanoid(12), nanoid(12), nanoid(12));

      sandbox.stub(Model.prototype, 'fetchOne').onCall(0).resolves(testNote);

      const { note } = await noteService.fetchNoteById(testNote.id);

      expect(note).to.deep.equal(testNote);
    });
  });

  describe('updateNoteById', (): void => {
    it('should update a note in the database given note id', async (): Promise<void> => {
      const testNote = new Note(nanoid(12), nanoid(12), nanoid(12));

      const fetchOneStub = sandbox.stub(Model.prototype, 'fetchOne').onCall(0).resolves(testNote);
      const updateStub = sandbox.stub(Model.prototype, 'update').onCall(0).resolves();

      await noteService.updateNoteById(testNote.id, testNote);

      expect(fetchOneStub.calledOnce).to.be.equal(true);
      expect(updateStub.calledOnce).to.be.equal(true);
    });
  });

  describe('deleteNoteById', (): void => {
    it('should delete a note from the database given note id', async (): Promise<void> => {
      const testNote = new Note(nanoid(12), nanoid(12), nanoid(12));

      const fetchOneStub = sandbox.stub(Model.prototype, 'fetchOne').onCall(0).resolves(testNote);
      const deleteStub = sandbox.stub(Model.prototype, 'delete').onCall(0).resolves();

      await noteService.deleteNoteById(testNote.id);

      expect(fetchOneStub.calledOnce).to.be.equal(true);
      expect(deleteStub.calledOnce).to.be.equal(true);
    });
  });

  describe('deleteNotes', (): void => {
    it('should delete a note from the database given note id', async (): Promise<void> => {
      const deleteStub = sandbox.stub(Model.prototype, 'delete').onCall(0).resolves();

      await noteService.deleteNotes();

      expect(deleteStub.calledOnce).to.be.equal(true);
    });
  });
};

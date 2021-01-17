import { FetchOptions, Filter, logger } from '../helpers';
import { Note, noteModel } from '../models';

export class NoteService {
  public async createNote(userId: string, title: string, body: string): Promise<{ note: Note }> {
    logger.debugFunctionCall('NoteService.createNote', arguments);
    const newNote = new Note(userId, title, body);
    const [id] = await noteModel.save(newNote);
    const note = await noteModel.fetchOne({ id });
    return { note };
  }

  public async fetchNotes(
    filter: Filter<Note> = {},
    options?: FetchOptions<any>,
  ): Promise<{ noteCount: number; notes: Note[] }> {
    logger.debugFunctionCall('NoteService.fetchNotes', arguments);
    const cursor = await noteModel.fetch(filter, options);
    const noteCount = await cursor.count();
    const notes = await cursor.toArray();
    return {
      noteCount,
      notes,
    };
  }

  public async fetchNoteById(id: string, options?: FetchOptions<any>): Promise<{ note: Note }> {
    logger.debugFunctionCall('NoteService.fetchNoteById', arguments);
    const note = await noteModel.fetchOne({ id }, options);
    return { note };
  }

  public async updateNoteById(id: string, note: Partial<Note>): Promise<void> {
    logger.debugFunctionCall('NoteService.updateNoteById', arguments);
    await noteModel.fetchOne({ id });
    await noteModel.update({ id }, { $set: note });
  }

  public async deleteNoteById(id: string): Promise<void> {
    logger.debugFunctionCall('NoteService.deleteNoteById', arguments);
    await noteModel.fetchOne({ id });
    await noteModel.delete({ id });
  }

  public async deleteNotes(filter: Filter<Note> = {}): Promise<void> {
    logger.debugFunctionCall('NoteService.deleteNotes', arguments);
    await noteModel.delete(filter);
  }
}

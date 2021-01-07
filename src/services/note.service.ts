import { Database, FetchOptions, Filter } from '../helpers';
import { Note, NoteModel } from '../models';
import { Logger } from '@zishone/logan';

export class NoteService {
  private logger: Logger;
  private noteModel: NoteModel;

  constructor(logger: Logger, database: Database) {
    this.logger = logger;
    this.noteModel = new NoteModel(logger, database);
  }

  public async createNote(userId: string, title: string, body: string): Promise<{ note: Note }> {
    this.logger.debugFunctionCall('NoteService.createNote', arguments);
    const newNote = this.noteModel.create(userId, title, body);
    const [id] = await this.noteModel.save(newNote);
    const note = await this.noteModel.fetchOne({ id });
    return { note };
  }

  public async fetchNotes(
    filter: Filter<Note> = {},
    options?: FetchOptions<any>,
  ): Promise<{ noteCount: number; notes: Note[] }> {
    this.logger.debugFunctionCall('NoteService.fetchNotes', arguments);
    const cursor = await this.noteModel.fetch(filter, options);
    const noteCount = await cursor.count();
    const notes = await cursor.toArray();
    return {
      noteCount,
      notes,
    };
  }

  public async fetchNoteById(id: string, options?: FetchOptions<any>): Promise<{ note: Note }> {
    this.logger.debugFunctionCall('NoteService.fetchNoteById', arguments);
    const note = await this.noteModel.fetchOne({ id }, options);
    return { note };
  }

  public async updateNoteById(id: string, note: Partial<Note>): Promise<void> {
    this.logger.debugFunctionCall('NoteService.updateNoteById', arguments);
    await this.noteModel.fetchOne({ id });
    await this.noteModel.update(
      {
        id,
        modifiedOn: Date.now(),
      },
      { $set: note },
    );
  }

  public async deleteNoteById(id: string): Promise<void> {
    this.logger.debugFunctionCall('NoteService.deleteNoteById', arguments);
    await this.noteModel.fetchOne({ id });
    await this.noteModel.delete({ id });
  }

  public async deleteNotes(filter: Filter<Note> = {}): Promise<void> {
    this.logger.debugFunctionCall('NoteService.deleteNotes', arguments);
    await this.noteModel.delete(filter);
  }
}

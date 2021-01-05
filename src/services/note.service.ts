import { FilterQuery, FindOneOptions } from 'mongodb';
import { Note, NoteModel } from '../models';
import { Logger } from '@zishone/logan';
import { Mongo } from '../helpers';

export class NoteService {
  private logger: Logger;
  private noteModel: NoteModel;

  constructor(logger: Logger, mongo: Mongo) {
    this.logger = logger;
    this.noteModel = new NoteModel(logger, mongo);
  }

  public async createUserNote(userId: string, title: string, body: string): Promise<{ note: Note }> {
    this.logger.debugFunctionCall('NoteService.createUserNote', arguments);
    const newNote = this.noteModel.create(userId, title, body);
    const [id] = await this.noteModel.save(newNote);
    const note = await this.noteModel.fetchOne({ id });
    return { note };
  }

  public async fetchUserNotes(
    userId: string,
    filter: FilterQuery<Note> = {},
    options?: FindOneOptions<any>,
  ): Promise<{ noteCount: number; notes: Note[] }> {
    this.logger.debugFunctionCall('NoteService.fetchUserNotes', arguments);
    const cursor = await this.noteModel.fetch(
      {
        ...filter,
        userId,
      },
      options,
    );
    const noteCount = await cursor.count();
    const notes = await cursor.toArray();
    return {
      noteCount,
      notes,
    };
  }

  public async fetchUserNoteById(userId: string, id: string, options?: FindOneOptions<any>): Promise<{ note: Note }> {
    this.logger.debugFunctionCall('NoteService.fetchUserNoteById', arguments);
    const note = await this.noteModel.fetchOne(
      {
        id,
        userId,
      },
      options,
    );
    return { note };
  }

  public async updateUserNoteById(userId: string, id: string, note: Partial<Note>): Promise<void> {
    this.logger.debugFunctionCall('NoteService.updateUserNoteById', arguments);
    await this.noteModel.fetchOne({
      id,
      userId,
    });
    await this.noteModel.update(
      {
        id,
        userId,
        modifiedOn: Date.now(),
      },
      { $set: note },
    );
  }

  public async deleteUserNoteById(userId: string, id: string): Promise<void> {
    this.logger.debugFunctionCall('NoteService.deleteUserNoteById', arguments);
    await this.noteModel.fetchOne({
      id,
      userId,
    });
    await this.noteModel.delete({
      id,
      userId,
    });
  }

  public async deleteUserNotes(userId: string, filter: FilterQuery<Note> = {}): Promise<void> {
    this.logger.debugFunctionCall('NoteService.deleteUserNotes', arguments);
    await this.noteModel.delete({
      ...filter,
      userId,
    });
  }
}

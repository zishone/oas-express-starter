import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '../helpers';
import {
  Note,
  NoteModel,
} from '../models';

export class NoteService {
  private logger: Logger;
  private noteModel: NoteModel;


  constructor(logger: Logger, mongo: Mongo) {
    this.logger = logger;
    this.noteModel = new NoteModel(logger, mongo);
  }

  public async createUserNote(userId: string, title: string, body: string): Promise<Note> {
    const newNote = this.noteModel.create(userId, title, body);
    const [id] = await this.noteModel.save(newNote);
    const note = await this.noteModel.fetchOne({ id });
    return note;
  }

  public async fetchUserNotes(userId: string, filter: FilterQuery<Note> = {}, options?: FindOneOptions<any>): Promise<Note[]> {
    const notes = await this.noteModel.fetch({
      ...filter,
      userId,
    }, options);
    return notes;
  }

  public async fetchUserNoteById(userId: string, id: string, options?: FindOneOptions<any>): Promise<Note> {
    const note = await this.noteModel.fetchOne({
      id,
      userId,
    }, options);
    return note;
  }

  public async updateUserNoteById(userId: string, id: string, note: Note): Promise<void> {
    await this.noteModel.fetchOne({
      id,
      userId,
    });
    await this.noteModel.update({
      id,
      userId,
      modifiedOn: Date.now(),
    }, { $set: note });
  }

  public async deleteUserNoteById(userId: string, id: string): Promise<void> {
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
    await this.noteModel.delete({
      ...filter,
      userId,
    });
  }
}

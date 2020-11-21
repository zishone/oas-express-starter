import {
  COLLECTIONS,
  ERROR_CODES,
  STATES,
} from '../constants';
import {
  Collection,
  Fail,
  Logger,
  Mongo,
} from '../helpers';
import { NoteModel } from '../models';

const logger = new Logger('service', __filename);

export class NoteService {
  private noteModel: NoteModel;
  private notesCollection: Collection;
  private reqId: string;
  private mongo: Mongo;

  constructor(reqId: string, mongo: Mongo) {
    this.reqId = reqId;
    this.mongo = mongo;
    this.noteModel = new NoteModel();
    this.notesCollection = this.mongo.collection(COLLECTIONS.NOTES, this.noteModel);
  }

  public async countNotes(filter?: any, options?: any): Promise<{ noteCount: number }> {
    logger.debug(this.reqId, 'countNotes', STATES.BEGUN);
    const noteCount = await this.notesCollection.countDocuments(filter, options);
    logger.debug(this.reqId, 'countNotes', STATES.SUCCEEDED);
    return { noteCount };
  }

  public async fetchNotes(filter?: any, options?: any): Promise<{ notes: any[] }> {
    logger.debug(this.reqId, 'fetchNotes', STATES.BEGUN);
    const cursor = await this.notesCollection.find(filter, options);
    const notes = await cursor.toArray();
    logger.debug(this.reqId, 'fetchNotes', STATES.SUCCEEDED);
    return { notes };
  }

  public async fetchNote(filter?: any, options?: any): Promise<{ note: any }> {
    logger.debug(this.reqId, 'fetchNote', STATES.BEGUN);
    const note = await this.notesCollection.findOne(filter, options);
    if (!note) {
      throw new Fail(404)
        .error({
          errorCode: ERROR_CODES.NOT_FOUND,
          keys: ['note'],
          message: 'Note does not exist.',
        })
        .build();
    }
    logger.debug(this.reqId, 'fetchNote', STATES.SUCCEEDED);
    return { note };
  }

  public async addNote(userId: string, title: string, body: string): Promise<{ noteId: string }> {
    logger.debug(this.reqId, 'addNote', STATES.BEGUN);
    const note = this.noteModel.newNote(userId, title, body);
    await this.notesCollection.insertOne(note);
    logger.debug(this.reqId, 'addNote', STATES.SUCCEEDED);
    return { noteId: note.noteId };
  }

  public async updateNote(filter: any, update: any): Promise<{}> {
    logger.debug(this.reqId, 'updateNote', STATES.BEGUN);
    if (Object.keys(update).length > 0) {
      update.modifiedOn = + Date.now();
    }
    await this.notesCollection.updateOne(filter, { $set: update });
    logger.debug(this.reqId, 'updateNote', STATES.SUCCEEDED);
    return {};
  }

  public async deleteNote(filter: any): Promise<{}> {
    logger.debug(this.reqId, 'deleteNote', STATES.BEGUN);
    await this.notesCollection.deleteOne(filter);
    logger.debug(this.reqId, 'deleteNote', STATES.SUCCEEDED);
    return {};
  }

  public async deleteNotes(filter: any): Promise<{}> {
    logger.debug(this.reqId, 'deleteNotes', STATES.BEGUN);
    await this.notesCollection.deleteMany(filter);
    logger.debug(this.reqId, 'deleteNotes', STATES.SUCCEEDED);
    return {};
  }
}

import { Database, Model } from '../helpers';
import { Logger } from '@zishone/logan';
import joi from 'joi';

export interface Note {
  id?: string;
  userId: string;
  title: string;
  body: string;
  modifiedOn: number;
  createdOn: number;
}

export class NoteModel extends Model<Note> {
  static collectionName: string = 'notes';
  static schema: joi.Schema = joi.object().keys({
    id: joi.string(),
    userId: joi.string(),
    title: joi.string(),
    body: joi.string(),
    modifiedOn: joi.number(),
    createdOn: joi.number(),
  });

  constructor(logger: Logger, database: Database) {
    super(logger, database, NoteModel.schema, NoteModel.collectionName);
  }

  public create(userId: string, title: string, body: string): Note {
    this.logger.debugFunctionCall('NoteModel.create', arguments);
    const note = {
      userId,
      title,
      body,
      modifiedOn: 0,
      createdOn: Date.now(),
    };
    return note;
  }
}

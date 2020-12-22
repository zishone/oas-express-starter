import {
  Logger,
  Model,
  Mongo,
} from '../helpers';
import joi from 'joi';
import { nanoid } from 'nanoid';

export interface Note {
  id?: string;
  userId?: string;
  title?: string;
  body?: string;
  modifiedOn?: number;
  createdOn?: number;
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

  constructor(logger: Logger, mongo: Mongo) {
    super(logger, mongo, NoteModel.schema, NoteModel.collectionName);
  }

  public create(userId: string, title: string, body: string): Note {
    return {
      id: nanoid(12),
      userId,
      title,
      body,
      modifiedOn: 0,
      createdOn: Date.now(),
    };
  }
}

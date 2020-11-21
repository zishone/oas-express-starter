import joi = require('joi');
import { Model } from '../helpers';
import { nanoid } from '../utils';

export class NoteModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      noteId: joi.string(),
      userId: joi.string(),
      title: joi.string(),
      body: joi.string(),
      modifiedOn: joi.number(),
      createdOn: joi.number(),
    });
    super(schema);
  }

  public newNote(userId: string, title: string, body: string) {
    return {
      noteId: nanoid(),
      userId,
      title,
      body,
      createdOn: Date.now(),
    };
  }
}

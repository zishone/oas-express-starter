import {
  Logger,
  Model,
  Mongo,
} from '../helpers';
import joi from 'joi';
import { nanoid } from 'nanoid';

export class ActivityModel extends Model {
  static collectionName: string = 'activities';
  static schema: joi.Schema = joi.object().keys({
    id: joi.string(),
    userId: joi.string(),
    type: joi.string(),
    createdOn: joi.number(),
  });

  constructor(logger: Logger, mongo: Mongo) {
    super(logger, mongo, ActivityModel.schema, ActivityModel.collectionName);
  }

  public create(userId: string, type: string) {
    return {
      id: nanoid(12),
      userId,
      type,
      createdOn: Date.now(),
    };
  }
}

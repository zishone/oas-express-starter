import joi = require('joi');
import { Model } from '../helpers';
import { nanoid } from '../utils';

export class ActivityModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      activityId: joi.string(),
      userId: joi.string(),
      description: joi.string().allow(''),
      type: joi.string(),
      state: joi.string(),
      ip: joi.string(),
      createdOn: joi.number(),
    });
    super(schema);
  }

  public newActivity(userId: string, type: string, state: string, ip: string) {
    return {
      activityId: nanoid(),
      userId,
      type,
      state,
      ip,
      createdOn: Date.now(),
    };
  }
}

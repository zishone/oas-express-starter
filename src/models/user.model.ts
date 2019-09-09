import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export class UserModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      _id: joi.string(),
      username: joi.string(),
      password: joi.string(),
      createDate: joi.number(),
    });
    super(schema);
  }
}

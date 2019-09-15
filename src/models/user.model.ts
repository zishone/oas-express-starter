import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class UserModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      username: joi.string(),
      password: joi.string(),
      createDate: joi.number(),
    });
    super(schema);
  }
}

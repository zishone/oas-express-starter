import { Model } from '../helpers';
import { ROLES } from '../constants';
import { nanoid } from '../utils';
import joi = require('joi');

export class UserModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      userId: joi.string(),
      username: joi.string(),
      email: joi.string(),
      password: joi.string(),
      name: joi.string(),
      role: joi.string(),
      modifiedOn: joi.number(),
      createdOn: joi.number(),
    });
    super(schema);
  }

  public newUser(username: string, email:string, saltedPassword: string, name: string) {
    return {
      userId: nanoid(),
      username,
      email,
      password: saltedPassword,
      name,
      role: ROLES.USER,
      createdOn: Date.now(),
    };
  }
}

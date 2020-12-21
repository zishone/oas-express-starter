import { Logger, Model, Mongo } from '../helpers';
import { ROLES } from '../constants';
import joi from 'joi';
import { nanoid } from 'nanoid';

export class UserModel extends Model {
  static collectionName: string = 'users';
  static schema: joi.Schema = joi.object().keys({
    id: joi.string(),
    username: joi.string(),
    email: joi.string(),
    password: joi.string(),
    name: joi.string(),
    role: joi.string(),
    modifiedOn: joi.number(),
    createdOn: joi.number(),
  });

  constructor(logger: Logger, mongo: Mongo) {
    super(logger, mongo, UserModel.schema, UserModel.collectionName);
  }

  public create(username: string, email:string, saltedPassword: string, name: string) {
    return {
      id: nanoid(12),
      username,
      email,
      password: saltedPassword,
      name,
      role: ROLES.USER,
      createdOn: Date.now(),
    };
  }
}

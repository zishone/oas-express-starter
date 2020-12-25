import { Logger, Model, Mongo } from '../helpers';
import joi from 'joi';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  createdOn?: number;
}

export class UserModel extends Model<User> {
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

  public create(role: string, username: string, email: string, saltedPassword: string, name: string): User {
    this.logger.debugFunction('UserModel.create', arguments);
    const user = {
      username,
      email,
      password: saltedPassword,
      name,
      role,
      createdOn: Date.now(),
    };
    return user;
  }
}

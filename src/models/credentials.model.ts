import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export class CredentialsModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().required(),
    });
    super(schema);
  }
}

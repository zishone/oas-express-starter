import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class CredentialsModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().required(),
    });
    super(schema);
  }
}

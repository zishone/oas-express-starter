import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class TokensModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      bearerToken: joi.string().required(),
      refreshToken: joi.string().required(),
    });
    super(schema);
  }
}

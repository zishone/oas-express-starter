import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export class TokensModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      bearerToken: joi.string().required(),
      refreshToken: joi.string().required(),
    });
    super(schema);
  }
}

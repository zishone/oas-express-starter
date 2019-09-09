import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export class HealthModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      health: joi.string(),
    });
    super(schema);
  }
}

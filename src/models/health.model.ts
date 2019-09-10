import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class HealthModel extends Model {
  constructor() {
    const schema = joi.object().keys({
      health: joi.string(),
    });
    super(schema);
  }
}

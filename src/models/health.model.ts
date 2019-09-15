import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class HealthModel extends Model {
  constructor() {
    const schema = joi.string();
    super(schema);
  }
}

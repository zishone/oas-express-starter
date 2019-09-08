import joi = require('@hapi/joi');
import { Model } from '../helpers';

export class GenericModel extends Model {
  constructor() {
    const schema = joi.alternatives().try(
      joi.boolean(),
      joi.object(),
      joi.number(),
      joi.string(),
    );
    super(schema);
  }
}

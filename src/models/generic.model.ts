import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export class GenericModel extends BaseModel {
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

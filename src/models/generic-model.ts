import { BaseModel } from '../helpers';
import { joi } from '../utils';

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

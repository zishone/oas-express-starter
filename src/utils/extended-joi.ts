import {
  extend,
  SchemaLike,
  string,
  ValidationResult,
} from '@hapi/joi';
import { ExtendedJoi } from '../types';

const joi: ExtendedJoi = extend({
  base: string().min(24).hex(),
  name: 'soid',
});

joi.validateMany = (schema: SchemaLike, data: any[]): ValidationResult<any[]> => {
  return joi.array().items(schema).validate(data);
};

export { joi };

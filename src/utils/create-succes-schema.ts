import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export function createSuccessSchema(dataRef: string) {
  const schema = joi.object().keys({
    status: joi.string().valid('success'),
    data: joi.object().default({
      $ref: dataRef,
    }),
  });
  return new BaseModel(schema).getOasSchema();
}

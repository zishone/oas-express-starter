import joi = require('@hapi/joi');
import { BaseModel } from '../helpers';

export function createErrorSchema(dataRef: string) {
  const schema = joi.object().keys({
    status: joi.string().valid('error'),
    message: joi.string(),
    code: joi.alternatives().try(joi.number(), joi.string()),
    data: joi.object().default({
      $ref: dataRef,
    }),
  });
  return new BaseModel(schema).getOasSchema();
}

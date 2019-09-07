import joi = require('@hapi/joi');
import { Model } from '../helpers';

export function createErrorSchema(dataRef: string) {
  const schema = joi.object().keys({
    status: joi.string().valid('error'),
    message: joi.string(),
    code: joi.alternatives().try(joi.number(), joi.string()),
    data: joi.object().default({
      $ref: dataRef,
    }),
  });
  return new Model(schema).getOasSchema();
}

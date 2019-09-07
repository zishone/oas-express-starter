import joi = require('@hapi/joi');
import { Model } from '../helpers';

export function createSuccessSchema(dataRef: string) {
  const schema = joi.object().keys({
    status: joi.string().valid('success'),
    data: joi.object().default({
      $ref: dataRef,
    }),
  });
  return new Model(schema).getOasSchema();
}

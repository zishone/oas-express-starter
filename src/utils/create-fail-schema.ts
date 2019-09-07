import joi = require('@hapi/joi');
import { Model } from '../helpers';

export function createFailSchema(dataRef: string) {
  const schema = joi.object().keys({
    status: joi.string().valid('fail'),
    data: joi.object().default({
      $ref: dataRef,
    }),
  });
  return new Model(schema).getOasSchema();
}

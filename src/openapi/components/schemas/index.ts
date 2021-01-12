import * as models from '../../../models';
import { Model } from '../../../helpers';
import { OpenAPIV3 } from 'openapi-types';
import { Schema } from 'joi';
import { generic } from './generic';
import { genericError } from './generic-error';
import { genericFail } from './generic-fail';
import { genericSuccess } from './generic-success';
import j2s from 'joi-to-swagger';
import { pagination } from './pagination';

export const schemas: { [schemaName: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject } = {
  generic,
  genericSuccess,
  genericFail,
  genericError,

  pagination,
};

for (const modelName in models) {
  const model = (models as { [modelName: string]: { prototype: object; schema: Schema } })[modelName];
  if (model.prototype instanceof Model) {
    schemas[modelName] = j2s(model.schema).swagger;
  }
}

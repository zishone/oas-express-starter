import * as models from '../../../models';
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
  schemas[modelName] = j2s((models as { [modelName: string]: { schema: Schema } })[modelName].schema).swagger;
}

import { OpenAPIV3 } from 'openapi-types';
import { error } from './error';
import { fail } from './fail';
import { generic } from './generic';
import { pagination } from './pagination';
import { success } from './success';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export const schemas: { [schemaName: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject } = {
  generic,

  success,
  fail,
  error,

  pagination,

  ...validationMetadatasToSchemas(),
};

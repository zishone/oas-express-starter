import { OpenAPIV3 } from 'openapi-types';

export const fields: OpenAPIV3.ParameterObject = {
  name: 'fields',
  in: 'query',
  description: 'Filters fields of an object. Example: `id;name;role`.',
  required: false,
  schema: { type: 'string' },
};

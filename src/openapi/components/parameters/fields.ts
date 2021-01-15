import { OpenAPIV3 } from 'openapi-types';

export const fields: OpenAPIV3.ParameterObject = {
  name: 'fields',
  in: 'query',
  description: 'Specify which fields of the objects to be returned. Example: `id;name;role`.',
  required: false,
  schema: { type: 'string' },
};

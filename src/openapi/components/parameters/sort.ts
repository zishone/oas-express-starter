import { OpenAPIV3 } from 'openapi-types';

export const sort: OpenAPIV3.ParameterObject = {
  name: 'sort',
  in: 'query',
  description: 'Sorts list of objects. Example: `id==asc;name==desc`.',
  required: false,
  schema: { type: 'string' },
};

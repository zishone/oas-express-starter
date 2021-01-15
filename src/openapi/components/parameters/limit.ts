import { OpenAPIV3 } from 'openapi-types';

export const limit: OpenAPIV3.ParameterObject = {
  name: 'limit',
  in: 'query',
  description: 'Limits elements in list of objects.',
  required: false,
  schema: { type: 'number' },
};

import { OpenAPIV3 } from 'openapi-types';

export const page: OpenAPIV3.ParameterObject = {
  name: 'page',
  in: 'query',
  description: 'Skips elements in list of objects based on the given limit.',
  required: false,
  schema: { type: 'number' },
};

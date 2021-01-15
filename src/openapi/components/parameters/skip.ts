import { OpenAPIV3 } from 'openapi-types';

export const skip: OpenAPIV3.ParameterObject = {
  name: 'skip',
  in: 'query',
  description: 'Skips elements in list of objects.',
  required: false,
  schema: { type: 'number' },
};

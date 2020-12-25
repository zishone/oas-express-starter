import { OpenAPIV3 } from 'openapi-types';

export const pagination: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    totalPages: { type: 'number' },
    totalItems: { type: 'number' },
  },
};

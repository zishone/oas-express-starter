import { OpenAPIV3 } from 'openapi-types';

export const generic: OpenAPIV3.SchemaObject = {
  oneOf: [
    { type: 'boolean' },
    { type: 'object' },
    {
      type: 'number',
      format: 'float',
    },
    { type: 'string' },
  ],
};

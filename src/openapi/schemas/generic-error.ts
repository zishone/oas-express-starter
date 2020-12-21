import { OpenAPIV3 } from 'openapi-types';

export const genericError: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['error'],
    },
    message: { type: 'string' },
    code: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
      ],
    },
    data: { $ref: '#/components/schemas/generic' },
  },
};

import { OpenAPIV3 } from 'openapi-types';

export const genericFail: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['fail'],
    },
    data: {
      type: 'object',
      properties: {
        errorCode: { type: 'string' },
        message: { type: 'string' },
        details: {
          type: 'array',
          items: { $ref: '#/components/schemas/generic' },
        },
      },
    },
  },
};

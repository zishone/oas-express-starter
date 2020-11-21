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
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              errorCode: { type: 'string' },
              keys: {
                type: 'array',
                items: { type: 'string' },
              },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

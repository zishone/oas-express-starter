import { OpenAPIV3 } from 'openapi-types';

export const genericFail: OpenAPIV3.ResponseObject = {
  description: '4XX Fail',
  content: {
    ['application/json']: {
      schema: {
        type: 'object',
        properties: {
          status: { $ref: '#/components/schemas/fail' },
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
      },
    },
  },
};

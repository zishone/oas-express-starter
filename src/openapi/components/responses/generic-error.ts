import { OpenAPIV3 } from 'openapi-types';

export const genericError: OpenAPIV3.ResponseObject = {
  description: '5XX Error',
  content: {
    ['application/json']: {
      schema: {
        type: 'object',
        properties: {
          status: { $ref: '#/components/schemas/error' },
          message: { type: 'string' },
          code: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          data: { $ref: '#/components/schemas/generic' },
        },
      },
    },
  },
};

import { OpenAPIV3 } from 'openapi-types';

export const genericSuccess: OpenAPIV3.ResponseObject = {
  description: '2XX Success',
  content: {
    ['application/json']: {
      schema: {
        type: 'object',
        properties: {
          status: { $ref: '#/components/schemas/success' },
          data: { $ref: '#/components/schemas/generic' },
        },
      },
    },
  },
};

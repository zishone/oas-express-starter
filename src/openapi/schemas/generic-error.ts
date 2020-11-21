import { OpenAPIV3 } from 'openapi-types';

export const genericError: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['error'],
    },
    message: {
      type: 'string',
    },
    code: {
      type: 'number',
      oneOf: [
        {
          type: 'string',
        },
      ],
    },
    data: {
      $ref: '#/components/schemas/generic',
    },
  },
};

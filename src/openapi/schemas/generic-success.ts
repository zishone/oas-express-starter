import { OpenAPIV3 } from 'openapi-types';

export const genericSuccess: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['success'],
    },
    data: {
      $ref: '#/components/schemas/generic',
    },
  },
};

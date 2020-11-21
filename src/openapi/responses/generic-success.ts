import { OpenAPIV3 } from 'openapi-types';

export const genericSuccess: OpenAPIV3.ResponseObject = {
  description: '2XX Success',
  content: {
    ['application/json']: {
      schema: {
        $ref: '#/components/schemas/genericSuccess',
      },
    },
  },
};

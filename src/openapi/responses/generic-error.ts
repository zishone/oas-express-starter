import { OpenAPIV3 } from 'openapi-types';

export const genericError: OpenAPIV3.ResponseObject = {
  description: '5XX Error',
  content: {
    ['application/json']: {
      schema: {
        $ref: '#/components/schemas/genericError',
      },
    },
  },
};

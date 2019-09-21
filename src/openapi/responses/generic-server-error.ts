import { OpenAPIV3 } from 'openapi-types';

export const genericServerError: OpenAPIV3.ResponseObject = {
  description: '5XX Server Error',
  content: {
    ['application/json']: {
      schema: {
        $ref: '#/components/schemas/genericError',
      },
    },
  },
};

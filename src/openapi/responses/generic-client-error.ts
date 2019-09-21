import { OpenAPIV3 } from 'openapi-types';

export const genericClientError: OpenAPIV3.ResponseObject = {
  description: '4XX Client Error',
  content: {
    ['application/json']: {
      schema: {
        $ref: '#/components/schemas/genericFail',
      },
    },
  },
};

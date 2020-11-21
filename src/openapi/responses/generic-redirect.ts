import { OpenAPIV3 } from 'openapi-types';

export const genericRedirect: OpenAPIV3.ResponseObject = {
  description: '3XX Redirect',
  content: {
    ['text/plain']: {
      schema: { type: 'string' },
    },
  },
};

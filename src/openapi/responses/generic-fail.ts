import { OpenAPIV3 } from 'openapi-types';

export const genericFail: OpenAPIV3.ResponseObject = {
  description: '4XX Fail',
  content: { ['application/json']: { schema: { $ref: '#/components/schemas/genericFail' } } },
};

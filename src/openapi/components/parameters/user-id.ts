import { OpenAPIV3 } from 'openapi-types';

export const userId: OpenAPIV3.ParameterObject = {
  name: 'userId',
  in: 'path',
  schema: { type: 'string' },
  description: "User's unique identifier",
  required: true,
};

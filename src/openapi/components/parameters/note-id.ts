import { OpenAPIV3 } from 'openapi-types';

export const noteId: OpenAPIV3.ParameterObject = {
  name: 'noteId',
  in: 'path',
  schema: { type: 'string' },
  description: "Note's unique identifier",
  required: true,
};

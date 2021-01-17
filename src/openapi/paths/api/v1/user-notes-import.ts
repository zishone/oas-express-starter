import { OpenAPIV3 } from 'openapi-types';

export const userNotesImport: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['User Notes'],
    operationId: 'postUserNotesImport',
    description: "Imports an authenticated user's note",
    security: [{ loginAuth: [] }],
    requestBody: {
      content: {
        ['multipart/form-data']: {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
      required: true,
    },
    responses: {
      ['201']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: {
                status: { $ref: '#/components/schemas/success' },
                data: {
                  type: 'object',
                  properties: { note: { $ref: '#/components/schemas/Note' } },
                },
              },
            },
          },
        },
      },
      ['2XX']: { $ref: '#/components/responses/genericSuccess' },
      ['3XX']: { $ref: '#/components/responses/genericRedirect' },
      ['4XX']: { $ref: '#/components/responses/genericFail' },
      ['5XX']: { $ref: '#/components/responses/genericError' },
      default: { $ref: '#/components/responses/generic' },
    },
  },
};

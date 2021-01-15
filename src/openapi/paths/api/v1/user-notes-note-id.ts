import { OpenAPIV3 } from 'openapi-types';

export const userNotesById: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['User Notes'],
    operationId: 'getUserNotesById',
    description: "Gets authenticated user's note",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/noteId' }, { $ref: '#/components/parameters/fields' }],
    responses: {
      ['200']: {
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
  patch: {
    tags: ['User Notes'],
    operationId: 'patchUserNotesById',
    description: "Updates authenticated user's note",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/noteId' }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              body: { type: 'string' },
            },
            minProperties: 1,
          },
        },
      },
      required: true,
    },
    responses: {
      ['204']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: { status: { $ref: '#/components/schemas/success' } },
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
  delete: {
    tags: ['User Notes'],
    operationId: 'deleteUserNotesById',
    description: "Deletes authenticated user's note",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/noteId' }],
    responses: {
      ['204']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: { status: { $ref: '#/components/schemas/success' } },
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

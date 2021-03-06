import { OpenAPIV3 } from 'openapi-types';

export const userNotesV1: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['User Notes'],
    operationId: 'postUserNotesV1',
    description: "Creates an authenticated user's note",
    security: [{ loginAuth: [] }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['body'],
            properties: {
              title: { $ref: '#/components/schemas/Note/properties/title' },
              body: { $ref: '#/components/schemas/Note/properties/body' },
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
  get: {
    tags: ['User Notes'],
    operationId: 'getUserNotesV1',
    description: "Gets authenticated user's notes",
    security: [{ loginAuth: [] }],
    parameters: [
      { $ref: '#/components/parameters/filter' },
      { $ref: '#/components/parameters/fields' },
      { $ref: '#/components/parameters/sort' },
      { $ref: '#/components/parameters/page' },
      { $ref: '#/components/parameters/skip' },
      { $ref: '#/components/parameters/limit' },
    ],
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
                  properties: {
                    pagination: { $ref: '#/components/schemas/pagination' },
                    notes: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Note' },
                    },
                  },
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

import { OpenAPIV3 } from 'openapi-types';

export const userNotes: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['User Notes'],
    operationId: 'postUserNotes',
    description: "Creates an authenticated user's note",
    security: [{ loginAuth: [] }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['body'],
            properties: {
              title: {
                type: 'string',
                default: 'Untitled Note',
              },
              body: { type: 'string' },
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
                status: {
                  type: 'string',
                  enum: ['success'],
                },
                data: {
                  type: 'object',
                  properties: { note: { $ref: '#/components/schemas/NoteModel' } },
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
    operationId: 'getUserNotes',
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
                status: {
                  type: 'string',
                  enum: ['success'],
                },
                data: {
                  type: 'object',
                  properties: {
                    pagination: { $ref: '#/components/schemas/pagination' },
                    notes: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/NoteModel' },
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

import { OpenAPIV3 } from 'openapi-types';

export const userV1: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['User'],
    operationId: 'getUserV1',
    description: "Gets authenticated user's info",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/fields' }],
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
                  properties: { user: { $ref: '#/components/schemas/User' } },
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
    tags: ['User'],
    operationId: 'patchUserV1',
    description: "Updates authenticated user's info",
    security: [{ loginAuth: [] }],
    parameters: [],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: {
              username: { $ref: '#/components/schemas/User/properties/username' },
              email: { $ref: '#/components/schemas/User/properties/email' },
              name: { $ref: '#/components/schemas/User/properties/name' },
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
    tags: ['User'],
    operationId: 'deleteUserV1',
    description: 'Deletes authenticated user',
    security: [{ loginAuth: [] }],
    parameters: [],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['password'],
            properties: { password: { $ref: '#/components/schemas/User/properties/password' } },
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
};

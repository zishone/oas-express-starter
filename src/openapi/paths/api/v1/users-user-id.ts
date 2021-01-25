import { OpenAPIV3 } from 'openapi-types';

export const usersUserIdV1: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['Users'],
    operationId: 'getUsersUserIdV1',
    description: "Gets a user's info",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/userId' }, { $ref: '#/components/parameters/fields' }],
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
    tags: ['Users'],
    operationId: 'patchUsersUserIdV1',
    description: "Updates a user's info",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/userId' }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: {
              username: { $ref: '#/components/schemas/User/properties/username' },
              email: { $ref: '#/components/schemas/User/properties/email' },
              name: { $ref: '#/components/schemas/User/properties/name' },
              password: { $ref: '#/components/schemas/User/properties/password' },
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
    tags: ['Users'],
    operationId: 'deleteUsersUserIdV1',
    description: 'Deletes a user',
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/userId' }],
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

import { OpenAPIV3 } from 'openapi-types';

export const users: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['Users'],
    operationId: 'getUsers',
    description: 'Gets users',
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
                    users: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/UserModel' },
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

export const usersById: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['Users'],
    operationId: 'getUsersById',
    description: "Gets a user's info",
    security: [{ loginAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: { type: 'string' },
        description: "User's unique identifier",
        required: true,
      },
      { $ref: '#/components/parameters/fields' },
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
                  properties: { user: { $ref: '#/components/schemas/UserModel' } },
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
    operationId: 'patchUsersById',
    description: "Updates a user's info",
    security: [{ loginAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: { type: 'string' },
        description: "User's unique identifier",
        required: true,
      },
    ],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              password: { type: 'string' },
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
              properties: {
                status: {
                  type: 'string',
                  enum: ['success'],
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
  delete: {
    tags: ['Users'],
    operationId: 'deleteUsersById',
    description: 'Deletes a user',
    security: [{ loginAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: { type: 'string' },
        description: "User's unique identifier",
        required: true,
      },
    ],
    responses: {
      ['204']: {
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

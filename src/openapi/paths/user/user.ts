import { OpenAPIV3 } from 'openapi-types';

export const user: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['User'],
    operationId: 'getUser',
    description: 'Gets authenticated user\'s info',
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
    tags: ['User'],
    operationId: 'patchUser',
    description: 'Updates authenticated user\'s info',
    security: [{ loginAuth: [] }],
    parameters: [],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
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
    tags: ['User'],
    operationId: 'deleteUser',
    description: 'Deletes authenticated user',
    security: [{ loginAuth: [] }],
    parameters: [],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['password'],
            properties: { password: { type: 'string' } },
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
};

export const userPassword: OpenAPIV3.PathItemObject = {
  put: {
    tags: ['User'],
    operationId: 'putUserPassword',
    description: 'Updates authenticated user\'s password',
    security: [{ loginAuth: [] }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: [
              'currentPassword',
              'newPassword',
            ],
            properties: {
              currentPassword: { type: 'string' },
              newPassword: { type: 'string' },
            },
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
};

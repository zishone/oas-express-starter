import { OpenAPIV3 } from 'openapi-types';

export const username: OpenAPIV3.PathItemObject = {
  get: {
    description: 'Gets a user.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    operationId: 'getUserController',
    parameters: [
      {
        in: 'path',
        name: 'username',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      ['2XX']: {
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
                  $ref: '#/components/schemas/user',
                },
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericFail',
      },
      default: {
        $ref: '#/components/responses/genericError',
      },
    },
  },
  put: {
    description: 'Updates a user.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    operationId: 'updateUserController',
    parameters: [
      {
        in: 'path',
        name: 'username',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            $ref: '#/components/schemas/user',
          },
        },
      },
      required: true,
    },
    responses: {
      ['2XX']: {
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
                  $ref: '#/components/schemas/user',
                },
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericFail',
      },
      default: {
        $ref: '#/components/responses/genericError',
      },
    },
  },
  delete: {
    description: 'Deletes a user.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    operationId: 'deleteUserController',
    parameters: [
      {
        in: 'path',
        name: 'username',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      ['2XX']: {
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
                  $ref: '#/components/schemas/user',
                },
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericFail',
      },
      default: {
        $ref: '#/components/responses/genericError',
      },
    },
  },
};

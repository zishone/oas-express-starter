import { OpenAPIV3 } from 'openapi-types';

export const register: OpenAPIV3.PathItemObject = {
  post: {
    description: 'Registers a new user.',
    operationId: 'registerController',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            $ref: '#/components/schemas/newUser',
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
                }
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericClientError',
      },
      default: {
        $ref: '#/components/responses/genericServerError',
      },
    },
  },
};

export const login: OpenAPIV3.PathItemObject = {
  post: {
    description: 'Authenticates a user.',
    operationId: 'loginController',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            $ref: '#/components/schemas/credentials',
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
                  $ref: '#/components/schemas/tokens',
                },
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericClientError',
      },
      default: {
        $ref: '#/components/responses/genericServerError',
      },
    },
  },
};

export const refresh: OpenAPIV3.PathItemObject = {
  get: {
    description: 'Refreshes access tokens.',
    operationId: 'refreshController',
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
                  $ref: '#/components/schemas/tokens',
                },
              },
            },
          },
        },
      },
      ['4XX']: {
        $ref: '#/components/responses/genericClientError',
      },
      default: {
        $ref: '#/components/responses/genericServerError',
      },
    },
  },
};

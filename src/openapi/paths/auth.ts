export const register = {
  post: {
    ['x-router-controller']: 'index',
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
      ['x-name']: 'body',
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
        $ref: '#components/responses/genericClientError',
      },
      default: {
        $ref: '#components/responses/genericServerError',
      },
    },
  },
};

export const login = {
  post: {
    ['x-router-controller']: 'index',
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
      ['x-name']: 'body',
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
        $ref: '#components/responses/genericClientError',
      },
      default: {
        $ref: '#components/responses/genericServerError',
      },
    },
  },
};

export const refresh = {
  post: {
    ['x-router-controller']: 'index',
    description: 'Refreshes access tokens.',
    operationId: 'refreshController',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            $ref: '#/components/schemas/tokens',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
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
        $ref: '#components/responses/genericClientError',
      },
      default: {
        $ref: '#components/responses/genericServerError',
      },
    },
  },
};

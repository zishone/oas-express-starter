import { createSuccessSchema } from '../../utils';

export const register = {
  post: {
    ['x-router-controller']: 'index',
    description: 'Registers a new user.',
    operationId: 'registerController',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/NewUser',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/User'),
          },
        },
      },
      400: {
        description: 'Fail',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericFailResponse',
            },
          },
        },
      },
      default: {
        description: 'Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericErrorResponse',
            },
          },
        },
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
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Credentials',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/Tokens'),
          },
        },
      },
      400: {
        description: 'Fail',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericFailResponse',
            },
          },
        },
      },
      default: {
        description: 'Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericErrorResponse',
            },
          },
        },
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
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Tokens',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/Tokens'),
          },
        },
      },
      400: {
        description: 'Fail',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericFailResponse',
            },
          },
        },
      },
      default: {
        description: 'Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericErrorResponse',
            },
          },
        },
      },
    },
  },
};

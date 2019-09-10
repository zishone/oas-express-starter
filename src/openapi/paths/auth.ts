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
            $ref: '#/components/schemas/newUser',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: '200 OK',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/user'),
          },
        },
      },
      400: {
        $ref: '#components/responses/genericBadRequest',
      },
      401: {
        $ref: '#components/responses/genericUnauthorized',
      },
      404: {
        $ref: '#components/responses/genericNotFound',
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
        'application/json': {
          schema: {
            $ref: '#/components/schemas/credentials',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: '200 OK',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/tokens'),
          },
        },
      },
      400: {
        $ref: '#components/responses/genericBadRequest',
      },
      401: {
        $ref: '#components/responses/genericUnauthorized',
      },
      404: {
        $ref: '#components/responses/genericNotFound',
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
        'application/json': {
          schema: {
            $ref: '#/components/schemas/tokens',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: '200 OK',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/tokens'),
          },
        },
      },
      400: {
        $ref: '#components/responses/genericBadRequest',
      },
      401: {
        $ref: '#components/responses/genericUnauthorized',
      },
      404: {
        $ref: '#components/responses/genericNotFound',
      },
      default: {
        $ref: '#components/responses/genericServerError',
      },
    },
  },
};

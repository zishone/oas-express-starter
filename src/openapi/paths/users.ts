import { createSuccessSchema } from '../../utils';

export const username = {
  get: {
    ['x-router-controller']: 'index',
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
  put: {
    ['x-router-controller']: 'index',
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
        'application/json': {
          schema: {
            $ref: '#/components/schemas/user',
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
  delete: {
    ['x-router-controller']: 'index',
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

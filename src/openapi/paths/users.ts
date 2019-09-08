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
            $ref: '#/components/schemas/User',
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

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
      ['2XX']: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/user'),
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
      ['2XX']: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/user'),
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
      ['2XX']: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/user'),
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

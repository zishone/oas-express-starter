import { createSuccessSchema } from '../../utils';

export const _ = {
  get: {
    ['x-router-controller']: 'index',
    description: 'Gets health.',
    operationId: 'healthController',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/Health'),
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

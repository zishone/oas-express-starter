import { createSuccessSchema } from '../../utils';

export const _ = {
  get: {
    ['x-router-controller']: 'index',
    description: 'Gets health.',
    operationId: 'healthController',
    responses: {
      200: {
        description: '200 OK',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/health'),
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

import { createSuccessSchema } from '../../utils';

export const _ = {
  get: {
    ['x-router-controller']: 'index',
    description: 'Gets health.',
    operationId: 'healthController',
    responses: {
      ['2XX']: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessSchema('#/components/schemas/health'),
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

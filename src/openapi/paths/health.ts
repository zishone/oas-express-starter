import { OpenAPIV3 } from 'openapi-types';

export const _: OpenAPIV3.PathItemObject = {
  get: {
    description: 'Gets health.',
    operationId: 'healthController',
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
                  $ref: '#/components/schemas/health',
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

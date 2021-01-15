import { OpenAPIV3 } from 'openapi-types';

export const users: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['Users'],
    operationId: 'getUsers',
    description: 'Gets users',
    security: [{ loginAuth: [] }],
    parameters: [
      { $ref: '#/components/parameters/filter' },
      { $ref: '#/components/parameters/fields' },
      { $ref: '#/components/parameters/sort' },
      { $ref: '#/components/parameters/page' },
      { $ref: '#/components/parameters/skip' },
      { $ref: '#/components/parameters/limit' },
    ],
    responses: {
      ['200']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: {
                status: { $ref: '#/components/schemas/success' },
                data: {
                  type: 'object',
                  properties: {
                    pagination: { $ref: '#/components/schemas/pagination' },
                    users: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      ['2XX']: { $ref: '#/components/responses/genericSuccess' },
      ['3XX']: { $ref: '#/components/responses/genericRedirect' },
      ['4XX']: { $ref: '#/components/responses/genericFail' },
      ['5XX']: { $ref: '#/components/responses/genericError' },
      default: { $ref: '#/components/responses/generic' },
    },
  },
};

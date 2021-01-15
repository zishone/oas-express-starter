import { OpenAPIV3 } from 'openapi-types';

export const register: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['Register'],
    operationId: 'postRegister',
    description: 'Registers a new user',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['username', 'email', 'password', 'name'],
            properties: {
              username: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
      required: true,
    },
    responses: {
      ['201']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: {
                status: { $ref: '#/components/schemas/success' },
                data: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
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

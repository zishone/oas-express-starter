import { OpenAPIV3 } from 'openapi-types';

export const login: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['Login'],
    operationId: 'postLogin',
    description: 'Authenticates a user',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: [
              'login',
              'password',
            ],
            properties: {
              login: { type: 'string' },
              password: { type: 'string' },
            },
          },
        },
      },
      required: true,
    },
    responses: {
      ['200']: {
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
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/UserModel' },
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

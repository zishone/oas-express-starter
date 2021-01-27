import { OpenAPIV3 } from 'openapi-types';

export const loginV1: OpenAPIV3.PathItemObject = {
  post: {
    tags: ['Login'],
    operationId: 'postLoginV1',
    description: 'Authenticates a user',
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['login', 'password'],
            properties: {
              login: {
                oneOf: [
                  { $ref: '#/components/schemas/User/properties/username' },
                  { $ref: '#/components/schemas/User/properties/email' },
                ],
              },
              password: { $ref: '#/components/schemas/User/properties/password' },
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
                status: { $ref: '#/components/schemas/success' },
                data: {
                  type: 'object',
                  properties: { accessToken: { type: 'string' } },
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

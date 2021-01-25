import { OpenAPIV3 } from 'openapi-types';

export const userPasswordV1: OpenAPIV3.PathItemObject = {
  put: {
    tags: ['User'],
    operationId: 'putUserPasswordV1',
    description: "Updates authenticated user's password",
    security: [{ loginAuth: [] }],
    requestBody: {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            required: ['currentPassword', 'newPassword'],
            properties: {
              currentPassword: { $ref: '#/components/schemas/User/properties/password' },
              newPassword: { $ref: '#/components/schemas/User/properties/password' },
            },
          },
        },
      },
      required: true,
    },
    responses: {
      ['204']: {
        description: 'Success',
        content: {
          ['application/json']: {
            schema: {
              type: 'object',
              properties: { status: { $ref: '#/components/schemas/success' } },
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

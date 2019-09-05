import { JsendOasSchema } from '../../helpers';

export const login = {
  post: {
    ['x-router-controller']: 'index',
    description: 'Authenticates a user.',
    operationId: 'loginController',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Login',
          },
        },
      },
      required: true,
      ['x-name']: 'body',
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: new JsendOasSchema('#/components/schemas/User').getSuccessSchema(),
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

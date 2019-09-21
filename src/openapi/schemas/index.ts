import { OpenAPIV3 } from 'openapi-types';
import {
  CredentialsModel,
  GenericModel,
  HealthModel,
  NewUserModel,
  TokensModel,
  UserModel,
} from '../../models';

export const schemas: {
  [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
} = {
  generic: new GenericModel().getOasSchema(),
  genericSuccess: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['success'],
      },
      data: {
        $ref: '#/components/schemas/generic',
      },
    },
  },
  genericFail: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['fail'],
      },
      data: {
        $ref: '#/components/schemas/generic',
      },
    },
  },
  genericError: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['error'],
      },
      message: {
        type: 'string',
      },
      code: {
        type: 'number',
        oneOf: [
          {
            type: 'string',
          },
        ],
      },
      data: {
        $ref: '#/components/schemas/generic',
      },
    },
  },
  health: new HealthModel().getOasSchema(),
  newUser: new NewUserModel().getOasSchema(),
  user: new UserModel().getOasSchema(),
  credentials: new CredentialsModel().getOasSchema(),
  tokens: new TokensModel().getOasSchema(),
};

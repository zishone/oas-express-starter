import {
  CredentialsModel,
  GenericModel,
  HealthModel,
  NewUserModel,
  TokensModel,
  UserModel,
} from '../../models';

export const schemas = {
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
        nullable: true,
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
        nullable: true,
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
        oneOf: [
          {
            type: 'number',
          },
          {
            type: 'string',
            nullable: true,
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

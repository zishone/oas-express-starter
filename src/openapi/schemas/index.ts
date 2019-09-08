import {
  CredentialsModel,
  GenericModel,
  HealthModel,
  NewUserModel,
  TokensModel,
  UserModel,
} from '../../models';
import {
  createErrorSchema,
  createFailSchema,
  createSuccessSchema,
} from '../../utils';

export const schemas = {
  Generic: new GenericModel().getOasSchema(),
  GenericSuccessResponse: createSuccessSchema('#/components/schemas/Generic'),
  GenericFailResponse: createFailSchema('#/components/schemas/Generic'),
  GenericErrorResponse: createErrorSchema('#/components/schemas/Generic'),
  Health: new HealthModel().getOasSchema(),
  NewUser: new NewUserModel().getOasSchema(),
  User: new UserModel().getOasSchema(),
  Credentials: new CredentialsModel().getOasSchema(),
  Tokens: new TokensModel().getOasSchema(),
};

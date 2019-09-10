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
  generic: new GenericModel().getOasSchema(),
  genericSuccessResponse: createSuccessSchema('#/components/schemas/generic'),
  genericFailResponse: createFailSchema('#/components/schemas/generic'),
  genericErrorResponse: createErrorSchema('#/components/schemas/generic'),
  health: new HealthModel().getOasSchema(),
  newUser: new NewUserModel().getOasSchema(),
  user: new UserModel().getOasSchema(),
  credentials: new CredentialsModel().getOasSchema(),
  tokens: new TokensModel().getOasSchema(),
};

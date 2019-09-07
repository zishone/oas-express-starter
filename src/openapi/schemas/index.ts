import {
  GenericModel,
  LoginRequestModel,
  RegisterRequestModel,
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
  NewUser: new RegisterRequestModel().getOasSchema(),
  User: new UserModel().getOasSchema(),
  LoginInput: new LoginRequestModel().getOasSchema(),
};

import { JsendOasSchema } from '../../helpers';
import {
  GenericModel,
  LoginRequestModel,
  RegisterRequestModel,
  UserModel,
} from '../../models';

export const schemas = {
  Generic: new GenericModel().getOasSchema(),
  GenericSuccessResponse: new JsendOasSchema('#/components/schemas/Generic').getSuccessSchema(),
  GenericFailResponse: new JsendOasSchema('#/components/schemas/Generic').getFailSchema(),
  GenericErrorResponse: new JsendOasSchema('#/components/schemas/Generic').getErrorSchema(),
  NewUser: new RegisterRequestModel().getOasSchema(),
  User: new UserModel().getOasSchema(),
  LoginInput: new LoginRequestModel().getOasSchema(),
};

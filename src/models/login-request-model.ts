import { BaseModel } from '../helpers';
import { joi } from '../utils';

export class LoginRequestModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().required(),
    });
    super(schema);
  }
}

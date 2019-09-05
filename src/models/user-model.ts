import { BaseModel } from '../helpers';
import { joi } from '../utils';

export class UserModel extends BaseModel {
  constructor() {
    const schema = joi.object().keys({
      _id: joi.soid(),
      username: joi.string(),
      password: joi.string(),
      createDate: joi.number(),
    });
    super(schema, 'User');
  }
}

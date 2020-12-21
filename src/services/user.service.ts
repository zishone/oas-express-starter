import {
  genSaltSync,
  hashSync,
} from 'bcryptjs';
import { ERROR_CODES } from '../constants';
import { Logger } from '../helpers';

export class UserService {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
}

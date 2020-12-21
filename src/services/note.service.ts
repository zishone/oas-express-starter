import { ERROR_CODES } from '../constants';
import { Logger } from '../helpers';

export class NoteService {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
}

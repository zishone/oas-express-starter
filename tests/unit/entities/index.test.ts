import { describe } from 'mocha';
import note from './note.test';
import user from './user.test';

describe('models', (): void => {
  describe('NoteModel', note);
  describe('UserModel', user);
});

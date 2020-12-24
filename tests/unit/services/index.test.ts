import { describe } from 'mocha';
import note from './note.test';
import user from './user.test';

describe('services', () => {
  note();
  user();
});

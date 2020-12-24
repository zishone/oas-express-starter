import { describe } from 'mocha';
import dotnotate from './dotnotate.test';
import paginate from './paginate.test';

describe('utils', () => {
  describe('*', () => {
    dotnotate();
    paginate();
  });
});

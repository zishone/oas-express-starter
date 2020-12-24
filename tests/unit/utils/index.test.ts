import { describe } from 'mocha';
import dotnotate from './dotnotate.test';
import paginate from './paginate.test';

describe('utils', (): void => {
  describe('*', (): void => {
    describe('dotnotate', dotnotate);
    describe('paginate', paginate);
  });
});

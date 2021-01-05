import { describe } from 'mocha';
import migrate from './migrate.test';
import paginate from './paginate.test';

describe('utils', (): void => {
  describe('util', (): void => {
    describe('migrate', migrate);
    describe('paginate', paginate);
  });
});

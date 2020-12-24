import { describe, it } from 'mocha';
import { expect } from 'chai';
import { paginate } from '../../../src/utils';

export default () => {
  describe('paginate', () => {
    it('should create pagination object given count and limit', async () => {
      const count = 0;
      const limit = 0;

      const paginationObject = paginate(count, limit);

      expect(paginationObject).to.deep.equal({
        totalItems: 0,
        totalPages: 0,
      });
    });
  });
};

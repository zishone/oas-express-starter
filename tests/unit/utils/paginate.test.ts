import { expect } from 'chai';
import { it } from 'mocha';
import { paginate } from '../../../src/utils';

export default (): void => {
  it('should create pagination object given count and limit', async (): Promise<void> => {
    const count = 0;
    const limit = 0;

    const paginationObject = paginate(count, limit);

    expect(paginationObject).to.deep.equal({
      totalItems: 0,
      totalPages: 0,
    });
  });
};

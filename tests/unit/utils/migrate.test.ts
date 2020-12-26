import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { it } from 'mocha';
import { migrate } from '../../../src/utils';
import migration from 'migrate-mongo';

export default (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  it('should migrate database', async (): Promise<void> => {
    const logger = { debug: (): void => null };
    const mongo = { getDb: async (): Promise<void> => null };

    sandbox.stub(migration, 'up').onCall(0).resolves();

    await migrate(logger as any, mongo as any);

    expect(true).to.be.equal(true);
  });
};

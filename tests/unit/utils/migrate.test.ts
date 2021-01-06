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
    const debugSpy = sandbox.spy();
    const logger = { debug: debugSpy };
    const getDbSpy = sandbox.spy();
    const mongo = { getDb: getDbSpy };

    sandbox.stub(migration, 'up').onCall(0).resolves();

    await migrate(logger as any, mongo as any);

    expect(debugSpy.calledOnce).to.be.equal(true);
    expect(getDbSpy.calledOnce).to.be.equal(true);
  });
};

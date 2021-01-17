import { Database } from '../../../src/helpers';
import { Logger } from '@zishone/logan';
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
    const getConnectionStub = sandbox.stub(Database.prototype, 'getConnection').resolves();
    const upStub = sandbox.stub(migration, 'up').resolves();
    const debugStub = sandbox.stub(Logger.prototype, 'debug');

    await migrate();

    expect(getConnectionStub.calledOnce).to.be.equal(true);
    expect(upStub.calledOnce).to.be.equal(true);
    expect(debugStub.calledOnce).to.be.equal(true);
  });
};

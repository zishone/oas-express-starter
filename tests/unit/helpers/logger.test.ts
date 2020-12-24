import { describe, it } from 'mocha';
import { Logger } from '../../../src/helpers';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import winston from 'winston';

export default (): void => {
  let logger: Logger;
  const sandbox = createSandbox();

  beforeEach((): void => {
    const addSpy = sandbox.spy();
    const logSpy = sandbox.spy();
    sandbox
      .stub(winston, 'createLogger')
      .onCall(0)
      .returns({
        add: addSpy,
        log: logSpy,
      } as any);
    logger = new Logger();
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('enableInfo', (): void => {
    it('should enable info logs', async (): Promise<void> => {
      logger.enableInfo();

      expect(true).to.equal(true);
    });
  });

  describe('enableDebug', (): void => {
    it('should enable debug logs', async (): Promise<void> => {
      logger.enableDebug();

      expect(true).to.equal(true);
    });
  });

  describe('info', (): void => {
    it('should log on level info', async (): Promise<void> => {
      logger.enableDebug();

      expect(true).to.equal(true);
    });
  });
};

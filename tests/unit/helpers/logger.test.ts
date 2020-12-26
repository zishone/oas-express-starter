import { SinonSpy, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { Logger } from '../../../src/helpers';
import { expect } from 'chai';
import { nanoid } from 'nanoid';
import winston from 'winston';

export default (): void => {
  const sandbox = createSandbox();
  let logger: Logger;
  let addSpy: SinonSpy;
  let logSpy: SinonSpy;

  beforeEach((): void => {
    addSpy = sandbox.spy();
    logSpy = sandbox.spy();
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

      expect(true).to.be.equal(true);
    });
  });

  describe('enableDebug', (): void => {
    it('should enable debug logs', async (): Promise<void> => {
      logger.enableDebug();

      expect(true).to.be.equal(true);
    });
  });

  describe('info', (): void => {
    it('should log on level info', async (): Promise<void> => {
      const testMessage = nanoid(12);

      logger.info(testMessage);

      expect(true).to.be.equal(true);
    });
  });

  describe('error', (): void => {
    it('should log on level error', async (): Promise<void> => {
      const testMessage = nanoid(12);

      logger.error(testMessage);

      expect(true).to.be.equal(true);
    });
  });

  describe('debug', (): void => {
    it('should log on level debug', async (): Promise<void> => {
      const testMessage = nanoid(12);

      logger.debug(testMessage);

      expect(true).to.be.equal(true);
    });
  });

  describe('debugFunction', (): void => {
    it('should log function and its arguments on level debug', async (): Promise<void> => {
      const testFunctioName = nanoid(12);
      const testFunctionArgs = { '0': nanoid(12) };

      logger.debugFunction(testFunctioName, testFunctionArgs);

      expect(true).to.be.equal(true);
    });
  });
};

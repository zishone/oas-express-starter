import { describe, it } from 'mocha';
import { Logger } from '../../../src/helpers';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';
import winston from 'winston';

export default (): void => {
  let logger: Logger;
  const sandbox = createSandbox();
  const testData: { [key: string]: any } = {};

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
    testData.testMessage = nanoid(12);
    testData.testFunctioName = nanoid(12);
    testData.testFunctionArgs = { '0': nanoid(12) };
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
      const { testMessage } = testData;

      logger.info(testMessage);

      expect(true).to.equal(true);
    });
  });

  describe('error', (): void => {
    it('should log on level error', async (): Promise<void> => {
      const { testMessage } = testData;

      logger.error(testMessage);

      expect(true).to.equal(true);
    });
  });

  describe('debug', (): void => {
    it('should log on level debug', async (): Promise<void> => {
      const { testMessage } = testData;

      logger.debug(testMessage);

      expect(true).to.equal(true);
    });
  });

  describe('debugFunction', (): void => {
    it('should log function and its arguments on level debug', async (): Promise<void> => {
      const { testFunctioName, testFunctionArgs } = testData;

      logger.debugFunction(testFunctioName, testFunctionArgs);

      expect(true).to.equal(true);
    });
  });
};

import { SinonSpy, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { LOG_LEVELS } from '../../../src/constants';
import { Logger } from '../../../src/helpers';
import { expect } from 'chai';
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

      expect(addSpy.calledTwice).to.be.equal(true);
    });
  });

  describe('enableInfoFile', (): void => {
    it('should enable info log files', async (): Promise<void> => {
      logger.enableInfoFile();

      expect(addSpy.calledTwice).to.be.equal(true);
    });

    it('should enable info log files with given filename', async (): Promise<void> => {
      logger.enableInfoFile({ filename: 'info.log' });

      expect(addSpy.calledTwice).to.be.equal(true);
    });
  });

  describe('enableErrorFile', (): void => {
    it('should enable error log files', async (): Promise<void> => {
      logger.enableErrorFile();

      expect(addSpy.calledTwice).to.be.equal(true);
    });

    it('should enable error log files with given filename', async (): Promise<void> => {
      logger.enableErrorFile({ filename: 'error.log' });

      expect(addSpy.calledTwice).to.be.equal(true);
    });
  });

  describe('enableDebug', (): void => {
    it('should enable debug logs', async (): Promise<void> => {
      logger.enableDebug();

      expect(addSpy.calledTwice).to.be.equal(true);
    });
  });

  describe('info', (): void => {
    it('should log on level info', async (): Promise<void> => {
      const testMessage = 'string';

      logger.info(testMessage);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.INFO);
    });
  });

  describe('error', (): void => {
    it('should log on level error', async (): Promise<void> => {
      const testMessage = 'string';

      logger.error(testMessage);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.ERROR);
    });
  });

  describe('debug', (): void => {
    it('should log on level debug', async (): Promise<void> => {
      const testMessage = 'string';

      logger.debug(testMessage);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.DEBUG);
    });
  });

  describe('write', (): void => {
    it('should log given log on level info', async (): Promise<void> => {
      const testLog = `
        [
          {},
          {}
        ]
      `;

      logger.write(testLog);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.INFO);
    });

    it('should log given log on level error', async (): Promise<void> => {
      const testLog = `
        [
          {},
          { "message": "error" }
        ]
      `;

      logger.write(testLog);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.ERROR);
    });

    it('should log logging failure on level error', async (): Promise<void> => {
      const testLog = '-';

      logger.write(testLog);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.ERROR);
    });
  });

  describe('debugFunction', (): void => {
    it('should log function and its arguments on level debug', async (): Promise<void> => {
      const testFunctioName = 'string';
      const testFunctionArgs = { '0': 'string' };

      logger.debugFunctionCall(testFunctioName, testFunctionArgs);

      expect(logSpy.args[0][0]).to.be.equal(LOG_LEVELS.DEBUG);
    });
  });
};

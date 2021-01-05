import { describe, it } from 'mocha';
import { SocketIO } from '../../../src/helpers';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import io from 'socket.io';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let socketIO: SocketIO;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const server = {};
    const mongo = {};
    socketIO = new SocketIO(logger as any, server as any, mongo as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('to', (): void => {
    it('should return Socket Server without room', async (): Promise<void> => {
      const server = socketIO.to();

      expect(server).to.exist;
    });

    it('should return Socket Server with room', async (): Promise<void> => {
      const toStub = sandbox.stub(io.Server.prototype, 'to');

      socketIO.to(nanoid(12));

      expect(toStub.calledOnce).to.be.equal(true);
    });
  });
};

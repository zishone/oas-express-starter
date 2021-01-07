import { describe, it } from 'mocha';
import { Socket } from '../../../src/helpers';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import io from 'socket.io';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let socket: Socket;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const server = {};
    const database = {};
    socket = new Socket(logger as any, server as any, database as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('to', (): void => {
    it('should return Socket Server without room', async (): Promise<void> => {
      const server = socket.to();

      expect(server).to.exist;
    });

    it('should return Socket Server with room', async (): Promise<void> => {
      const toStub = sandbox.stub(io.Server.prototype, 'to');

      socket.to(nanoid(12));

      expect(toStub.calledOnce).to.be.equal(true);
    });
  });
};

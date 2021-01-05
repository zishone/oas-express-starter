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
    const mongo = {};
    socket = new Socket(logger as any, server as any, mongo as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('sendTo', (): void => {
    it('should send to given room', async (): Promise<void> => {
      const emitSpy = sandbox.spy();
      sandbox
        .stub(io.Server.prototype, 'to')
        .onCall(0)
        .returns({ emit: emitSpy } as any);

      socket.sendTo(nanoid(12), nanoid(12), {});

      expect(emitSpy.calledOnce).to.be.equal(true);
    });
  });

  describe('broadcast', (): void => {
    it('should broadcast', async (): Promise<void> => {
      const emitStub = sandbox.stub(io.Server.prototype, 'emit');

      socket.broadcast(nanoid(12), {});

      expect(emitStub.calledOnce).to.be.equal(true);
    });
  });
};

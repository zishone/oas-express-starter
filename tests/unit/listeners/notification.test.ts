import { EventEmitter } from 'events';
import { ROLES } from '../../../src/constants';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { it } from 'mocha';
import { nanoid } from 'nanoid';
import { notificationListener } from '../../../src/listeners';

export default (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  it('should listen to notification event and notify user', async (): Promise<void> => {
    const errorSpy = sandbox.spy();
    const logger = { error: errorSpy };
    const emitter = new EventEmitter();
    const sendToSpy = sandbox.spy();
    const broadcastSpy = sandbox.spy();
    const socket = {
      sendTo: sendToSpy,
      broadcast: broadcastSpy,
    };

    notificationListener(logger as any, emitter, socket as any);
    emitter.emit('notification', {
      id: nanoid(12),
      data: {},
    });

    expect(sendToSpy.calledOnce).to.be.equal(true);
  });

  it('should listen to notification event and notify role', async (): Promise<void> => {
    const errorSpy = sandbox.spy();
    const logger = { error: errorSpy };
    const emitter = new EventEmitter();
    const sendToSpy = sandbox.spy();
    const broadcastSpy = sandbox.spy();
    const socket = {
      sendTo: sendToSpy,
      broadcast: broadcastSpy,
    };

    notificationListener(logger as any, emitter, socket as any);
    emitter.emit('notification', {
      role: ROLES.ADMIN,
      data: {},
    });

    expect(sendToSpy.calledOnce).to.be.equal(true);
  });

  it('should listen to notification event and broadcast', async (): Promise<void> => {
    const errorSpy = sandbox.spy();
    const logger = { error: errorSpy };
    const emitter = new EventEmitter();
    const sendToSpy = sandbox.spy();
    const broadcastSpy = sandbox.spy();
    const socket = {
      sendTo: sendToSpy,
      broadcast: broadcastSpy,
    };

    notificationListener(logger as any, emitter, socket as any);
    emitter.emit('notification', { data: {} });

    expect(broadcastSpy.calledOnce).to.be.equal(true);
  });

  it('should listen to notification event and throw an error', async (): Promise<void> => {
    const errorSpy = sandbox.spy();
    const logger = { error: errorSpy };
    const emitter = new EventEmitter();
    const sendToSpy = sandbox.spy();
    const socket = {
      sendTo: sendToSpy,
      broadcast: () => {
        throw new Error();
      },
    };

    notificationListener(logger as any, emitter, socket as any);
    emitter.emit('notification', { data: {} });

    expect(errorSpy.calledOnce).to.be.equal(true);
  });
};

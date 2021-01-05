import { EventEmitter } from 'events';
import { Logger } from '@zishone/logan';
import { Socket } from '../helpers';

export const notificationListener = (logger: Logger, emitter: EventEmitter, socket: Socket): void => {
  emitter.on(
    'notification',
    async ({ id, role, data }: { id?: string; role?: string; data: { [key: string]: any } }) => {
      try {
        if (id) {
          socket.sendTo(id, 'notification', data);
        }
        if (role) {
          socket.sendTo(role, 'notification', data);
        }
        if (!id && !role) {
          socket.broadcast('notification', data);
        }
      } catch (error) {
        logger.error('Notification listener failed', { error });
      }
    },
  );
};

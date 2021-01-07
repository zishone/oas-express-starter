import { ExtendedSocket, Server } from 'socket.io';
import { ERROR_CODES } from '../constants';
import { Logger } from '@zishone/logan';
import { Mongo } from '.';
import { UserModel } from '../models';
import { config } from '../config';
import http from 'http';
import { verify } from 'jsonwebtoken';

export class Socket {
  private server: Server;
  private userModel: UserModel;
  private clientCount: number;

  constructor(logger: Logger, server: http.Server, mongo: Mongo) {
    this.server = new Server(server);
    this.userModel = new UserModel(logger, mongo);
    this.clientCount = 0;
    this.server.use(async (extendedSocket: ExtendedSocket, next: (error?: any) => void) => {
      try {
        const { id } = verify((extendedSocket.handshake.query as { token: string }).token, config.LOGIN_SECRET) as {
          id: string;
        };
        extendedSocket.user = await this.userModel.fetchOne({ id }, { projection: { password: 0 } });
        next();
      } catch (error) {
        error.data = {
          errorCode: ERROR_CODES.UNAUTHENTICATED,
          details: [
            {
              message: 'Authentication failed.',
            },
          ],
        };
        next(error);
      }
    });
    this.server.on('connection', (extendedSocket: ExtendedSocket): void => {
      const { id, role } = extendedSocket.user;
      this.clientCount++;
      logger.debug('Socket client connected', {
        'user.id': id,
        'user.role': role,
        'client.count': this.clientCount,
      });
      extendedSocket.join(id);
      extendedSocket.join(role);
      extendedSocket.on('disconnect', (): void => {
        this.clientCount--;
        logger.debug('Socket client disconnected', {
          'user.id': id,
          'user.role': role,
          'client.count': this.clientCount,
        });
      });
    });
  }

  public to(name?: string): Server {
    if (name) {
      return this.server.to(name);
    }
    return this.server;
  }
}

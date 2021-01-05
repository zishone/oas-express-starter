import { ERROR_CODES } from '../constants';
import { Logger } from '@zishone/logan';
import { Mongo } from '.';
import { UserModel } from '../models';
import { config } from '../config';
import http from 'http';
import io from 'socket.io';
import { verify } from 'jsonwebtoken';

export class Socket {
  private server: io.Server;
  private userModel: UserModel;
  private clientCount: number;

  constructor(logger: Logger, server: http.Server, mongo: Mongo) {
    this.server = new io.Server(server);
    this.userModel = new UserModel(logger, mongo);
    this.clientCount = 0;
    this.server.use(async (socket: io.ExtendedSocket, next: (error?: any) => void) => {
      try {
        const { id } = verify((socket.handshake.query as { token: string }).token, config.LOGIN_SECRET) as {
          id: string;
        };
        socket.user = await this.userModel.fetchOne({ id }, { projection: { password: 0 } });
        next();
      } catch (error) {
        error.data = {
          status: 'fail',
          data: {
            details: [
              {
                errorCode: ERROR_CODES.UNAUTHENTICATED,
                message: 'Authentication failed.',
              },
            ],
          },
        };
        next(error);
      }
    });
    this.server.on('connection', (socket: io.ExtendedSocket): void => {
      if (socket.user) {
        const { id, role } = socket.user;
        this.clientCount++;
        logger.debug('Socket client connected', {
          'user.id': id,
          'user.role': role,
          'client.count': this.clientCount,
        });
        socket.join(id);
        socket.join(role);
        socket.on('disconnect', (): void => {
          this.clientCount--;
          logger.debug('Socket client disconnected', {
            'user.id': id,
            'user.role': role,
            'client.count': this.clientCount,
          });
        });
      }
    });
  }

  public sendTo(name: string, event: string, data: { [key: string]: any }) {
    this.server.to(name).emit(event, data);
  }

  public broadcast(event: string, data: { [key: string]: any }) {
    this.server.emit(event, data);
  }
}

import 'express';
import { Mongo, SocketIO } from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    mongo: Mongo;
    socketIO: SocketIO;
    user: User;
  }
}

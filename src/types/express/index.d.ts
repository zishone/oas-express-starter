import 'express';
import { Mongo, Socket } from '../../helpers';
import { AddressInfo } from 'net';
import { User } from '../../models';

declare module 'express' {
  interface Application {
    address?(): AddressInfo;
  }

  interface Request {
    id: string;
    mongo: Mongo;
    io: Socket;
    user: User;
  }
}

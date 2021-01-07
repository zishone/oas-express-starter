import 'express';
import { Database, Socket } from '../../helpers';
import { AddressInfo } from 'net';
import { User } from '../../models';

declare module 'express' {
  interface Application {
    address?(): AddressInfo;
  }

  interface Request {
    id: string;
    database: Database;
    io: Socket;
    user: User;
  }
}

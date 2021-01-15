import 'express';
import { AddressInfo } from 'net';
import { Database } from '../../helpers';
import { User } from '../../entities';

declare module 'express' {
  interface Application {
    address?(): AddressInfo;
  }

  interface Request {
    id: string;
    database: Database;
    user: User;
  }
}

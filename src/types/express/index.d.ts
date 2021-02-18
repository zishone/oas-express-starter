import 'express';
import { AddressInfo } from 'net';
import { User } from '../../models';

declare module 'express' {
  interface Application {
    address?(): AddressInfo;
  }

  interface Request {
    id: string;
    user: User;
    info: { [key: string]: any };
    error: any;
  }
}

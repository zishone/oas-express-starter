import 'express';
import { Mongo } from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    mongo: Mongo;
    user: User;
  }
}

import 'express';
import { EventEmitter } from 'events';
import { Mongo } from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    mongo: Mongo;
    emitter: EventEmitter;
    user: User;
  }
}

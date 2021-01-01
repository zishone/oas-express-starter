import 'express';
import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import { Mongo } from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    mongo: Mongo;
    mquery: {
      filter: FilterQuery<any>;
      options: FindOneOptions<any>;
    };
    user: User;
  }
}

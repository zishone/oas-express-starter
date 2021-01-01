import 'express';
import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    logger: Logger;
    mongo: Mongo;
    mquery: {
      filter: FilterQuery<any>;
      options: FindOneOptions<any>;
    };
    user: User;
    addLogData: (data: { [key: string]: any }) => void;
    addLogError: (error: any) => void;
  }
}

import {
  Root,
  SchemaLike,
  StringSchema,
  ValidationResult,
} from '@hapi/joi';
import {
  Application,
  Request,
  Response,
} from 'express';
import {
  MongoClientCommonOption,
  MongoClientOptions,
} from 'mongodb';
import { MongoManager } from '../helpers/mongo-manager';

export interface AppContext {
  app: Application;
  mongo?: MongoManager;
}

export interface Request extends Request {
  context: AppContext;
  swagger: {
    params: any;
  };
}

export interface Response extends Response {
  jsend: {
    success: (data: any, statusCode?: number) => void;
    fail: (data: any, statusCode?: number) => void;
    error: (error: Error, statusCode?: number) => void;
  };
}

export interface ExtendedJoi extends Root {
  soid: () => StringSchema;
  validateMany: (schema: SchemaLike, data: any[]) => ValidationResult<any[]>;
}

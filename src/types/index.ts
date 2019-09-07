import {
  MongoClientCommonOption,
  MongoClientOptions,
} from 'mongodb';

export interface MongoConfig {
  mongoUri: string;
  dbName: string;
  clientOptions?: MongoClientOptions;
  dbOptions?: MongoClientCommonOption;
}

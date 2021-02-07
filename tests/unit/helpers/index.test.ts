import database from './database.test';
import { describe } from 'mocha';
import logger from './logger.test';
import model from './model.test';

describe('helpers', (): void => {
  describe('Database', database);
  describe('Logger', logger);
  describe('Model<any>', model);
});

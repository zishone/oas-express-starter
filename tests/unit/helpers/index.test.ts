import { describe } from 'mocha';
import logger from './logger.test';
import model from './model.test';
import mongo from './mongo.test';

describe('helpers', (): void => {
  describe('Logger', logger);
  describe('Model<any>', model);
  describe('Mongo', mongo);
});

import { describe } from 'mocha';
import logger from './logger.test';
import mongo from './mongo.test';

describe('helpers', (): void => {
  describe('Logger', logger);
  describe('Mongo', mongo);
});

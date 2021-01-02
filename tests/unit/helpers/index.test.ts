import { describe } from 'mocha';
import model from './model.test';
import mongo from './mongo.test';

describe('helpers', (): void => {
  describe('Model<any>', model);
  describe('Mongo', mongo);
});

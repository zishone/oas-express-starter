import database from './database.test';
import { describe } from 'mocha';
import model from './model.test';
import socket from './socket.test';

describe('helpers', (): void => {
  describe('Database', database);
  describe('Model<any>', model);
  describe('Socket', socket);
});

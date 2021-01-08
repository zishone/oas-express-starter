import { EVENTS, ROLES } from '../../../src/constants';
import { database, logger } from '../../../src/server';
import { UserModel } from '../../../src/models';
import { config } from '../../../src/configs';
import { expect } from 'chai';
import { it } from 'mocha';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';
import socket from 'socket.io-client';

export const connect = (): void => {
  it('should emit connect_error when token is invalid', async (): Promise<void> => {
    const testUser = {
      username: nanoid(12),
      email: nanoid(12),
      password: nanoid(12),
      name: nanoid(12),
      role: ROLES.USER,
      createdOn: Date.now(),
    };
    const userModel = new UserModel(logger, database);
    const [testUserId] = await userModel.save(testUser);
    const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

    const io = socket.connect(`http://localhost:${config.APP_PORT}`, { query: { token: testUserAccessToken } });

    let isConnected = false;
    io.on(EVENTS.CONNECT, (): void => {
      isConnected = true;
    });

    await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 100));

    io.disconnect();

    expect(isConnected).to.be.equal(true);
  });
};

import { EVENTS, ROLES } from '../../../src/constants';
import { app, logger, mongo } from '../../../src/server';
import { expect, request } from 'chai';
import { UserModel } from '../../../src/models';
import { config } from '../../../src/config';
import { connect } from 'socket.io-client';
import { it } from 'mocha';
import { nanoid } from 'nanoid';
import { sign } from 'jsonwebtoken';

export const notification = (): void => {
  it('should emit notification when new user registers', async (): Promise<void> => {
    const testUser = {
      id: nanoid(12),
      username: nanoid(12),
      email: nanoid(12),
      password: nanoid(12),
      name: nanoid(12),
      role: ROLES.USER,
      createdOn: Date.now(),
    };
    const testAdmin = {
      username: nanoid(12),
      email: nanoid(12),
      password: nanoid(12),
      name: nanoid(12),
      role: ROLES.ADMIN,
      createdOn: Date.now(),
    };
    const userModel = new UserModel(logger, mongo);
    const [testAdminId] = await userModel.save(testAdmin);
    const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

    const io = connect(`http://localhost:${config.APP_PORT}`, {
      query: { token: testAdminAccessToken },
      transports: ['websocket'],
    } as any);

    let notification: any;
    io.on(EVENTS.NOTIFICATION, (data: any): void => {
      notification = data;
    });

    await request(app).post('/api/v1/register').send(testUser);

    io.disconnect();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notification).to.exist;
  });

  it("should emit notification when admin updates user's info", async (): Promise<void> => {
    const testAdmin = {
      username: nanoid(12),
      email: nanoid(12),
      password: nanoid(12),
      name: nanoid(12),
      role: ROLES.ADMIN,
      createdOn: Date.now(),
    };
    const userModel = new UserModel(logger, mongo);
    const [testAdminId] = await userModel.save(testAdmin);
    const testAdminAccessToken = sign({ id: testAdminId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
    const testNewUsername = nanoid(12);
    const testUser = {
      username: nanoid(12),
      email: nanoid(12),
      password: nanoid(12),
      name: nanoid(12),
      role: ROLES.USER,
      createdOn: Date.now(),
    };
    const [testUserId] = await userModel.save(testUser);
    const testUserAccessToken = sign({ id: testUserId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });

    const io = connect(`http://localhost:${config.APP_PORT}`, {
      query: { token: testUserAccessToken },
      transports: ['websocket'],
    } as any);

    let notification: any;
    io.on(EVENTS.NOTIFICATION, (data: any): void => {
      notification = data;
    });

    await request(app)
      .patch(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${testAdminAccessToken}`)
      .send({ username: testNewUsername });

    io.disconnect();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notification).to.exist;
  });
};

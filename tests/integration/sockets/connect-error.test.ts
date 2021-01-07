import { EVENTS } from '../../../src/constants';
import { config } from '../../../src/config';
import { connect } from 'socket.io-client';
import { expect } from 'chai';
import { it } from 'mocha';
import { nanoid } from 'nanoid';

export const connectError = (): void => {
  it('should emit connect_error when token is invalid', async (): Promise<void> => {
    const io = connect(`http://localhost:${config.APP_PORT}`, { query: { token: nanoid(12) } });

    let error: any;
    io.on(EVENTS.CONNECT_ERROR, (data: any): void => {
      error = data;
    });

    await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 100));

    expect(error).to.exist;
  });
};

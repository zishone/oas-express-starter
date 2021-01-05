import { Socket } from 'socket.io';
import { User } from '../../models';

declare module 'socket.io' {
  export interface ExtendedSocket extends Socket {
    user: User;
  }
}

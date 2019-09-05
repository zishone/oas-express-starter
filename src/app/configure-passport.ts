import * as passport from 'passport';
import {
  ExtractJwt,
  Strategy,
  VerifiedCallback,
} from 'passport-jwt';
import { authConfig } from '../config';
import { UserModel } from '../models';
import { AppContext } from '../types';

export const composeMiddlewares = async (context: AppContext): Promise<AppContext> => {
  const strategy = new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secret,
    },
    async (payload: any, done: VerifiedCallback) => {
      try {
        const user = await new UserModel().crudify(context.mongo!).find({
          username: payload.username,
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  );
  passport.use(strategy);
  return context;
};

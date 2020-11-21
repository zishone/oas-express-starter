import {
  ACTIVITY_TYPES,
  ERROR_CODES,
  STATES,
} from '../../constants';
import {
  Fail,
  Logger,
} from '../../helpers';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { UserService } from '../../services';
import { compareSync } from 'bcryptjs';
import { config } from '../../config';
import { sign } from 'jsonwebtoken';

const logger = new Logger('controller', __filename);

/**
 * POST /api/v1/login
 */
export const postLogin = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'postLogin', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const {
      login,
      password,
    } = req.body;

    const { user } = await userService.fetchUser({
      $or: [
        { username: login },
        { email: login },
      ],
    })
      .catch((error: any) => {
        if (error.status === 404) {
          throw new Fail(401)
            .error({
              errorCode: ERROR_CODES.INVALID_CREDENTIALS,
              keys: ['login', 'password'],
              message: 'Provided username/email or password is invalid.',
            })
            .build();
        }
        throw error;
      });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      req.emmiter.emit('activity', {
        req,
        user,
        type: ACTIVITY_TYPES.USER_LOGIN,
        state: STATES.FAILED,
      });
      throw new Fail(401)
        .error({
          errorCode: ERROR_CODES.INVALID_CREDENTIALS,
          keys: ['username', 'email', 'password'],
          message: 'Provided username/email or password is invalid.',
        })
        .build();
    }
    delete user.password;

    logger.debug(req.id, 'postLogin', STATES.SUCCEEDED);
    const accessToken = sign({ userId: user.userId }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
    req.emmiter.emit('activity', {
      req,
      user,
      type: ACTIVITY_TYPES.USER_LOGIN,
      state: STATES.SUCCEEDED,
    });
    res.jsend.success({
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

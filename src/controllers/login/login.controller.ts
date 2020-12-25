import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services';

/**
 * POST /api/v1/login
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { login, password } = req.body;

    const { accessToken } = await userService.authenticateUser(login, password);

    res.jsend.success({ accessToken });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../../services';
import { paginate } from '../../../utils';

/**
 * GET /api/v1/users
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.database);

    const { filter, options } = req.mquery;

    const { userCount, users } = await userService.fetchUsers(filter, options);
    const pagination = paginate(userCount, options.limit);

    res.jsend.success({
      pagination,
      users,
    });
  } catch (error) {
    next(error);
  }
};

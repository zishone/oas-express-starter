import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const healthController = async (req: Request, res: Response , _: NextFunction) => {
  res.jsend.success({
    health: 'Alive!',
  });
};

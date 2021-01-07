import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';

/**
 * GET /health
 */
export const getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await req.database.getConnection();

    res.jsend.success({
      name: config.APP_NAME,
      version: config.APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

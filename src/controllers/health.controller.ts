import { NextFunction, Request, Response } from 'express';
import { database } from '../helpers';
import { pkgConfig } from '../configs';

/**
 * GET /health
 */
export const getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await database.getConnection();

    res.jsend.success({
      name: pkgConfig.APP_NAME,
      version: pkgConfig.APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

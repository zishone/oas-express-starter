import { Request } from 'express';

export const extractIp = (req: Request): string => {
  const ip = (req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || '').split(',')[0].trim();
  return ip;
};

import { RequestHandler } from 'express';
import { join } from 'path';
import multer from 'multer';

export const uploadMiddleware = (fieldName: string): RequestHandler => {
  return multer({ dest: join('.data', 'uploads') }).single(fieldName);
};

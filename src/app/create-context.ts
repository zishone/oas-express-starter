import { Application } from 'express';
import { AppContext } from '../types';

export const createContext = async (app: Application): Promise<AppContext> => {
  const context = { app };
  return context;
};

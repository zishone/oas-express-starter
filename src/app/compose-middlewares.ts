import {
  json,
  urlencoded,
} from 'express';
import {
  accessControlMiddleware,
  contextMiddleware,
  jsendMiddleware,
} from '../middlewares';
import { AppContext } from '../types';

export const composeMiddlewares = async (context: AppContext): Promise<AppContext> => {
  context.app.use(json());
  context.app.use(urlencoded({ extended: true }));
  context.app.use(accessControlMiddleware());
  context.app.use(jsendMiddleware());
  context.app.use(contextMiddleware(context));
  return context;
};

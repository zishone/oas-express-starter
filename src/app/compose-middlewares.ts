import cors = require('cors');
import {
  json,
  urlencoded,
} from 'express';
import { corsConfig } from '../config';
import {
  contextMiddleware,
  jsendMiddleware,
} from '../middlewares';
import { AppContext } from '../types';

export const composeMiddlewares = async (context: AppContext): Promise<AppContext> => {
  context.app.use(json());
  context.app.use(urlencoded({ extended: true }));
  context.app.use(cors(corsConfig));
  context.app.use(contextMiddleware(context));
  context.app.use(jsendMiddleware());
  return context;
};

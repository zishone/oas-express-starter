import express = require('express');
import { composeMiddlewares } from './app/compose-middlewares';
import { configureOas } from './app/configure-oas';
import { connectMongo } from './app/connect-mongo';
import { createContext } from './app/create-context';
import { AppContext } from './types';

export const init = async () => {
  let context: AppContext;
  context = await createContext(express());
  context = await composeMiddlewares(context);
  context = await configureOas(context);
  context = await connectMongo(context);
  return context.app;
};

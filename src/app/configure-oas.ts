import oasTools = require('oas-tools');
import { oasConfig } from '../config';
import { spec } from '../openapi';
import { AppContext } from '../types';

export const configureOas = async (context: AppContext): Promise<AppContext> => {
  oasTools.configure(oasConfig);
  await new Promise((resolve, reject) => {
    oasTools.initialize(spec, context.app, (error: Error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
  return context;
};

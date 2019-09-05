import * as oasTools from 'oas-tools';
import { join } from 'path';
import { spec } from '../openapi';
import { AppContext } from '../types';

export const configureOas = async (context: AppContext): Promise<AppContext> => {
  oasTools.configure({
    controllers: join(__dirname, '..', 'controllers'),
    checkControllers: true,
    loglevel: 'info',
    strict: false,
    router: true,
    validator: true,
    docs: {
      apiDocs: '/api-docs',
      apiDocsPrefix: '',
      swaggerUi: '/docs',
      swaggerUiPrefix: '',
    },
    // oasSecurity: true,
    // securityFile: {
    //   // your security settings
    // },
    // oasAuth: true,
    // grantsFile: {
    //   // your authorization settings
    // },
    ignoreUnknownFormats: true,
  });
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

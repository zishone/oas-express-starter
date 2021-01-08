import { OpenAPIV3 } from 'openapi-types';
import { config } from '../configs';
import { parameters } from './parameters';
import { paths } from './paths';
import { responses } from './responses';
import { schemas } from './schemas';
import { securitySchemes } from './security-schemes';

export const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    version: config.APP_VERSION,
    title: config.APP_NAME,
  },
  paths,
  components: {
    parameters,
    securitySchemes,
    responses,
    schemas,
  },
};

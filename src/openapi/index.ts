import { OpenAPIV3 } from 'openapi-types';
import { config } from '../configs';
import { parameters } from './components/parameters';
import { paths } from './paths';
import { responses } from './components/responses';
import { schemas } from './components/schemas';
import { securitySchemes } from './components/security-schemes';

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

import { OpenAPIV3 } from 'openapi-types';
import { parameters } from './components/parameters';
import { paths } from './paths';
import { pkgConfig } from '../configs';
import { responses } from './components/responses';
import { schemas } from './components/schemas';
import { securitySchemes } from './components/security-schemes';

export const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    version: pkgConfig.APP_VERSION,
    title: pkgConfig.APP_NAME,
  },
  paths,
  components: {
    parameters,
    securitySchemes,
    responses,
    schemas,
  },
};

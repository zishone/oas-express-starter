import { OpenAPIV3 } from 'openapi-types';
import { paths } from './paths';
import { responses } from './responses';
import { schemas } from './schemas';
import { securitySchemes } from './security-schemes';
import { servers } from './servers';

export const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    version: require('../../package.json').version,
    title: require('../../package.json').name,
  },
  paths,
  servers,
  components: {
    responses,
    schemas,
    securitySchemes,
  },
};

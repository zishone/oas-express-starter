import { OpenAPIV3 } from 'openapi-types';
import { parameters } from './parameters';
import { paths } from './paths';
import { responses } from './responses';
import { schemas } from './schemas';
import { securitySchemes } from './security-schemes';

export const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    version: require('../../package.json').version,
    title: require('../../package.json').name,
  },
  paths,
  components: {
    parameters,
    securitySchemes,
    responses,
    schemas,
  },
};

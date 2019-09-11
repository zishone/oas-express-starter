import { appConfig } from '../config';
import { paths } from './paths';
import { responses } from './responses';
import { schemas } from './schemas';
import { securitySchemes } from './security-schemes';
import { servers } from './servers';

export const spec = {
  openapi: '3.0.0',
  info: {
    version: appConfig.version,
    title: appConfig.name,
  },
  paths,
  servers,
  components: {
    responses,
    schemas,
    securitySchemes,
  },
};

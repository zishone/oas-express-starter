import { paths } from './paths';
import { responses } from './responses';
import { schemas } from './schemas';
import { securitySchemes } from './security-schemes';
import { servers } from './servers';

export const spec = {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'oas-express-starter',
  },
  paths,
  servers,
  components: {
    responses,
    schemas,
    securitySchemes,
  },
};

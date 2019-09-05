import { paths } from './paths';
import { schemas } from './schemas';
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
    schemas,
  },
};

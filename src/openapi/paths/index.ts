import { OpenAPIV3 } from 'openapi-types';
import auth = require('./auth');
import health = require('./health');
import users = require('./users');

export const paths: OpenAPIV3.PathsObject = {
  '/health': health._,
  '/auth/register': auth.register,
  '/auth/login': auth.login,
  '/auth/refresh': auth.refresh,
  '/users/{username}': users.username,
};

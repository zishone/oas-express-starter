import auth = require('./auth');
import health = require('./health');
import users = require('./users');

export const paths = {
  '/health': health._,
  '/auth/register': auth.register,
  '/auth/login': auth.login,
  '/auth/refresh': auth.refresh,
  '/users/{username}': users.username,
};

import { OpenAPIV3 } from 'openapi-types';
import activities = require('./activities/activities');
import health = require('./health/health');
import login = require('./login/login');
import register = require('./register/register');
import userNotes = require('./user/notes');
import user = require('./user/user');
import users = require('./users/users');

export const paths: OpenAPIV3.PathsObject = {
  '/health': health.health,

  '/api/v1/login': login.login,

  '/api/v1/register': register.register,

  '/api/v1/user': user.user,
  '/api/v1/user/password': user.userPassword,

  '/api/v1/user/notes': userNotes.userNotes,
  '/api/v1/user/notes/{noteId}': userNotes.userNotesById,

  '/api/v1/users': users.users,
  '/api/v1/users/{userId}': users.usersById,

  '/api/v1/activities': activities.activities,
  '/api/v1/activities/{activityId}': activities.activitiesById,
};

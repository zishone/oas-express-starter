import { genericBadRequest } from './generic-bad-request';
import { genericNotFound } from './generic-not-found';
import { genericServerError } from './generic-server-error';
import { genericUnauthorized } from './generic-unauthorized';

export const responses = {
  genericBadRequest,
  genericUnauthorized,
  genericNotFound,
  genericServerError,
};

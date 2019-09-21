import { OpenAPIV3 } from 'openapi-types';
import { genericClientError } from './generic-client-error';
import { genericServerError } from './generic-server-error';

export const responses: OpenAPIV3.ResponsesObject = {
  genericClientError,
  genericServerError,
};

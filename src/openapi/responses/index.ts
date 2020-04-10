import { OpenAPIV3 } from 'openapi-types';
import { genericError } from './generic-error';
import { genericFail } from './generic-fail';

export const responses: OpenAPIV3.ResponsesObject = {
  genericFail,
  genericError,
};

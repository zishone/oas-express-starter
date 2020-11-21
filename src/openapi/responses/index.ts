import { OpenAPIV3 } from 'openapi-types';
import { generic } from './generic';
import { genericError } from './generic-error';
import { genericFail } from './generic-fail';
import { genericRedirect } from './generic-redirect';
import { genericSuccess } from './generic-success';

export const responses: OpenAPIV3.ResponsesObject = {
  generic,
  genericSuccess,
  genericRedirect,
  genericFail,
  genericError,
};

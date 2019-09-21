import { OpenAPIV3 } from 'openapi-types';
import { bearerAuth } from './bearer-auth';

export const securitySchemes: {
  [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SecuritySchemeObject,
} = {
  bearerAuth,
};

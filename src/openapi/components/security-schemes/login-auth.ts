import { OpenAPIV3 } from 'openapi-types';

export const loginAuth: OpenAPIV3.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
};

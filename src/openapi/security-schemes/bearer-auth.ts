import { OpenAPIV3 } from 'openapi-types';

export const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
};

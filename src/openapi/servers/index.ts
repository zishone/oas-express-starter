import { OpenAPIV3 } from 'openapi-types';
import { apiV1 } from './api-v1';

export const servers: OpenAPIV3.ServerObject[] = [
  apiV1,
];

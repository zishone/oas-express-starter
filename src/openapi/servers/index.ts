import { apiV1 } from './api-v1';
import { OpenAPIV3 } from 'openapi-types';

export const servers: OpenAPIV3.ServerObject[] = [
  apiV1,
];

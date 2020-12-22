import { OpenAPIV3 } from 'openapi-types';

export const pagination: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    currentPage: { type: 'number' },
    currentPageItems: { type: 'number' },
    itemsPerPage: { type: 'number' },
    totalPages: { type: 'number' },
    totalItems: { type: 'number' },
  },
};

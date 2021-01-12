import { OpenAPIV3 } from 'openapi-types';
import { openapi } from '@zishone/monique';

const { fields, filter, limit, page, skip, sort } = openapi.components.parameters;

export const parameters: { [parameterName: string]: OpenAPIV3.ParameterObject } = {
  filter,
  fields,
  sort,
  page,
  skip,
  limit,
};

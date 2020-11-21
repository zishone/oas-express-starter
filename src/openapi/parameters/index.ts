import { OpenAPIV3 } from 'openapi-types';
import { fields } from './fields';
import { filter } from './filter';
import { limit } from './limit';
import { page } from './page';
import { skip } from './skip';
import { sort } from './sort';

export const parameters: { [key: string]: OpenAPIV3.ParameterObject } = {
  filter,
  fields,
  sort,
  page,
  skip,
  limit,
};

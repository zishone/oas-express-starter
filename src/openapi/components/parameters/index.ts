import { OpenAPIV3 } from 'openapi-types';
import { fields } from './fields';
import { filter } from './filter';
import { limit } from './limit';
import { noteId } from './note-id';
import { page } from './page';
import { skip } from './skip';
import { sort } from './sort';
import { userId } from './user-id';

export const parameters: { [parameterName: string]: OpenAPIV3.ParameterObject } = {
  filter,
  fields,
  sort,
  page,
  skip,
  limit,

  userId,
  noteId,
};

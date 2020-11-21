import {
  ActivityModel,
  NoteModel,
  UserModel,
} from '../../models';
import { OpenAPIV3 } from 'openapi-types';
import { generic } from './generic';
import { genericError } from './generic-error';
import { genericFail } from './generic-fail';
import { genericSuccess } from './generic-success';
import { pagination } from './pagination';

export const schemas: { [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject } = {
  generic,
  genericSuccess,
  genericFail,
  genericError,

  pagination,

  user: new UserModel().getOasSchema(),
  note: new NoteModel().getOasSchema(),
  activity: new ActivityModel().getOasSchema(),
};

import { OpenAPIV3 } from 'openapi-types';

export const filter: OpenAPIV3.ParameterObject = {
  name: 'filter',
  in: 'query',
  description: 'Filters list of objects. Example: `id==1;name=a;role==a1,role==b2`. Read more at: https://www.npmjs.com/package/rsql-mongodb',
  required: false,
  schema: { type: 'string' },
};

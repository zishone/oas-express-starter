import { AnySchema } from '@hapi/joi';
import { convert } from 'joi-openapi';
import { ModelCrud, MongoManager } from '.';

class BaseModel {
  constructor(
    private schema: AnySchema,
    public collectionName?: string,
  ) {}

  public getOasSchema(): any {
    return convert(this.schema);
  }

  public crudify(mongo: MongoManager) {
    return new ModelCrud(mongo, this);
  }
}

export { BaseModel };

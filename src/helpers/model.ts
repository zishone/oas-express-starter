import joi = require('@hapi/joi');
import { convert } from 'joi-openapi';
import { OpenAPIV3 } from 'openapi-types';

export class Model {
  constructor(private schema: joi.Schema) {}

  public getJoiSchema(): joi.Schema {
    return this.schema;
  }

  public getOasSchema(): OpenAPIV3.SchemaObject {
    return convert(this.schema)!;
  }

  public async validateOne(value: any): Promise<any> {
    const {
      error,
      value: result,
    } = this.schema.validate(value);
    if (error) {
      throw error;
    }
    return result;
  }

  public async validateMany(value: any[]): Promise<any[]> {
    const {
      error,
      value: result,
    } = joi.array().items(this.schema).validate(value);
    if (error) {
      throw error;
    }
    return result;
  }
}

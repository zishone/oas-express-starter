import { AnySchema } from '@hapi/joi';
import joi = require('@hapi/joi');
import { convert } from 'joi-openapi';

export class Model {
  constructor(private schema: AnySchema) {}

  public getJoiSchema(): any {
    return this.schema;
  }

  public getOasSchema(): any {
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

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

  public async validate(value: any): Promise<void> {
    const { error } = this.schema.validate(value);
    if (error) {
      throw error;
    }
  }

  public async validateMany(value: any[]): Promise<void> {
    const { error } = joi.array().items(this.schema).validate(value);
    if (error) {
      throw error;
    }
  }
}

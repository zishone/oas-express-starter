import joi = require('joi');
import { ERROR_CODES } from '../constants';
import { OpenAPIV3 } from 'openapi-types';
import { convert } from 'joi-openapi';

export class Model {
  private schema: joi.Schema;

  constructor(schema: joi.Schema) {
    this.schema = schema;
  }

  public getJoiSchema(): joi.Schema {
    return this.schema;
  }

  public getOasSchema(): OpenAPIV3.SchemaObject {
    // TODO: Fix joi ot openapi conversion
    return convert({
      isJoi: true,
      ...this.schema,
    });
  }

  public async validateOne(value: any, line?: number): Promise<any> {
    const result = this.schema.validate(value);
    if (result.error) {
      const error = {
        status: 400,
        errors: result.error.details.map((vError) => {
          return {
            ...vError,
            errorCode: ERROR_CODES.INVALID,
            keys: vError.path,
            message: `Provided fields ${vError.path.join(', ')} is/are invalid${line ? ` on line ${line}.` : '.'}`,
          };
        }),
      };
      throw error;
    }
    return result.value;
  }

  public async validateMany(value: any[]): Promise<any[]> {
    const result = joi.array().items(this.schema).validate(value);
    if (result.error) {
      const error = {
        status: 400,
        errors: result.error.details.map((vError) => {
          return {
            ...vError,
            errorCode: ERROR_CODES.INVALID,
            keys: vError.path,
            message: `Provided fields ${vError.path.join(', ')} is/are invalid.`,
          };
        }),
      };
      throw error;
    }
    return result.value;
  }
}

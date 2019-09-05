import { BaseModel } from '.';
import { joi } from '../utils';

export class JsendOasSchema {
  constructor(private dataRef: string) {}

  public getSuccessSchema() {
    const schema = joi.object().keys({
      status: joi.string().valid('success'),
      data: joi.object().default({
        $ref: this.dataRef,
      }),
    });
    return new BaseModel(schema).getOasSchema();
  }

  public getFailSchema() {
    const schema = joi.object().keys({
      status: joi.string().valid('fail'),
      data: joi.object().default({
        $ref: this.dataRef,
      }),
    });
    return new BaseModel(schema).getOasSchema();
  }

  public getErrorSchema() {
    const schema = joi.object().keys({
      status: joi.string().valid('error'),
      message: joi.string(),
      code: joi.alternatives().try(joi.number(), joi.string()),
      data: joi.object().default({
        $ref: this.dataRef,
      }),
    });
    return new BaseModel(schema).getOasSchema();
  }
}

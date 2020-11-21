export class Fail {
  private fail: {
    status: number;
    errors: any[];
  };

  constructor(status: number = 400) {
    this.fail = {
      status,
      errors: [],
    };
  }

  public status(status: any) {
    this.fail.status = status;
    return this;
  }

  public error(fail: any) {
    this.fail.errors.push(fail);
    return this;
  }

  public getErrorLength() {
    return this.fail.errors.length;
  }

  public build() {
    return this.fail;
  }
}

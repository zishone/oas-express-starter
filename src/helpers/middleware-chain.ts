export class MiddlewareChain {
  private middlewares: any[];

  constructor(...middlewares: any[]) {
    this.middlewares = middlewares;
  }

  public getHandler(): any {
    return (...args: any[]) => {
      const chain = this.middlewares.concat((..._args: any[]) => _args.slice(0, args.length));
      const next = (..._args: any[]) => chain.shift()(...(_args.length > 0 ? _args : args), next);
      return next();
    };
  }
}

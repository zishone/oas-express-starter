import 'migrate-mongo';

declare module 'migrate-mongo' {
  namespace config {
    function set(config: Partial<Config>): Promise<void>;
  }
}

import * as migration from 'migrate-mongo';

declare module 'migrate-mongo' {
  namespace config {
    function set(config: migration.config.Config): Promise<void>;
  }
}

import * as migration from 'migrate-mongo';

declare module 'migrate-mongo' {
  namespace config {
    function set(config: { migrationsDir: string, changelogCollectionName: string }): Promise<void>;
  }
}

require('dotenv-defaults/config');

const { CONFIG_DB_URI, CONFIG_DB_NAME } = process.env;

const config = {
  mongodb: {
    url: CONFIG_DB_URI,
    databaseName: CONFIG_DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 3600000,
      socketTimeoutMS: 3600000,
    },
  },
  migrationsDir: 'db/migrations',
  changelogCollectionName: 'migrations',
  migrationFileExtension: '.js',
};

module.exports = config;

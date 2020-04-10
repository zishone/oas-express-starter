export const mongoConfig = {
  mongoUri: process.env.CONFIG_MONGO_URI || 'mongodb://127.0.0.1:27017/',
  dbName: process.env.CONFIG_DB_NAME || 'oasDB',
  clientOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export const loggerConfig = {
  morgan: {
    format: process.env.CONFIG_MORGAN_FORMAT || 'combined',
  },
};

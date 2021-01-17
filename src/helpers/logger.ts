import { Logger } from '@zishone/logan';
import { config } from '../configs';

export const logger = new Logger({
  defaultMeta: {
    service: config.APP_NAME,
    version: config.APP_VERSION,
  },
});

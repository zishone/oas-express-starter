import { Logger } from '@zishone/logan';
import { pkgConfig } from '../configs';

export const logger = new Logger({
  defaultMeta: {
    service: pkgConfig.APP_NAME,
    version: pkgConfig.APP_VERSION,
  },
});

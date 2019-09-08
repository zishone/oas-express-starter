import { appConfig } from '../../config';

export const servers: any[] = [
  {
    url: `http://localhost:${appConfig.port}/api/v1`,
  },
];

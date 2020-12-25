import { describe } from 'mocha';
import { health } from './health/health.test';

describe('routes', (): void => {
  describe('/health', health);
});

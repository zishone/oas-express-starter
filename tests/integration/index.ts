import { ENVIRONMENTS } from '../../src/constants';

process.env.NODE_ENV = ENVIRONMENTS.INTEGRATION;

process.env.CONFIG_DB_NAME = `oasDB-test-${Date.now()}`;

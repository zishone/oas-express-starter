import {
  Logger,
  MongoManager,
} from '../helpers';

const logger = new Logger('service', __filename);

export class HealthCheckService {
  constructor(
    private reqId: string,
    private mongo: MongoManager,
  ) {}

  public async getHealth() {
    logger.debug(this.reqId, 'getHealth', 'begun');
    await this.mongo.getDb();
    logger.debug(this.reqId, 'getHealth', 'succeeded');
    return 'Healthy!';
  }
}

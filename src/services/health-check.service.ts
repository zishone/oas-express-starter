import {
  Logger,
  MongoManager,
  Service,
} from '../helpers';

const logger = new Logger('service', __filename);

export class HealthCheckService extends Service {
  constructor(
    private reqId: string,
    private mongo: MongoManager,
  ) {
    super(null);
  }

  public async getHealth() {
    logger.debug(this.reqId, 'getHealth', 'begun');
    await this.mongo.getDb();
    logger.debug(this.reqId, 'getHealth', 'succeeded');
    return 'Healthy!';
  }
}

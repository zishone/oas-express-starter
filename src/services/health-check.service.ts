import { MongoManager } from '../helpers';

export class HealthCheckService {
  constructor(private mongo: MongoManager) {}

  public async getHealth() {
    await this.mongo.getDb();
    return 'Healthy!';
  }
}

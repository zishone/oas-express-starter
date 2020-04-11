import { COLLECTIONS } from '../constants';
import {
  Logger,
  MongoCollection,
  MongoManager,
} from '../helpers';
import { Service } from '../helpers/service';
import { UserModel } from '../models';

const logger = new Logger('service', __filename);

export class UsersService extends Service {
  private userCollection: MongoCollection;

  constructor(
    private reqId: string,
    private mongo: MongoManager,
  ) {
    super(null);
    this.userCollection = this.mongo.collection(COLLECTIONS.USERS, new UserModel());
  }

  public async getUser(username: string): Promise<any> {
    logger.debug(this.reqId, 'getUser', 'begun');
    const projection = { password: 0 };
    const user = await this.userCollection.findOne({ username }, { projection });
    if (!user) {
      this.fail = { username: 'User not found.' };
      logger.debug(this.reqId, 'getUser', 'failed', this.fail);
      return;
    }
    logger.debug(this.reqId, 'getUser', 'succeeded');
    return user;
  }

  public async updateUser(username: string, update: any): Promise<any> {
    logger.debug(this.reqId, 'updateUser', 'begun');
    delete update.username;
    delete update.password;
    await this.userCollection.updateOne({ username }, { $set: update });
    const filter = { username };
    const projection = { password: 0 };
    const user = await this.userCollection.findOne(filter, { projection });
    if (!user) {
      this.fail = { username: 'User not found.' };
      logger.debug(this.reqId, 'updateUser', 'failed', this.fail);
      return;
    }
    logger.debug(this.reqId, 'updateUser', 'succeeded');
    return user;
  }

  public async deleteUser(username: string): Promise<any> {
    logger.debug(this.reqId, 'deleteUser', 'begun');
    const projection = { password: 0 };
    const user = await this.userCollection.findOne({ username }, { projection });
    if (!user) {
      this.fail = { username: 'User not found.' };
      logger.debug(this.reqId, 'deleteUser', 'failed', this.fail);
      return;
    }
    await this.userCollection.deleteOne({ username });
    logger.debug(this.reqId, 'deleteUser', 'succeeded');
    return user;
  }
}

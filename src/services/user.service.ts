import {
  COLLECTIONS,
  ERROR_CODES,
  STATES,
} from '../constants';
import {
  Collection,
  Fail,
  Logger,
  Mongo,
} from '../helpers';
import {
  genSaltSync,
  hashSync,
} from 'bcryptjs';
import { UserModel } from '../models';
import { config } from '../config';

const logger = new Logger('service', __filename);

export class UserService {
  private userModel: UserModel;
  private usersCollection: Collection;
  private reqId: string;
  private mongo: Mongo;

  constructor(reqId: string, mongo: Mongo) {
    this.reqId = reqId;
    this.mongo = mongo;
    this.userModel = new UserModel();
    this.usersCollection = this.mongo.collection(COLLECTIONS.USERS, this.userModel);
  }

  public async countUsers(filter?: any, options?: any): Promise<{ userCount: number }> {
    logger.debug(this.reqId, 'countUsers', STATES.BEGUN);
    const userCount = await this.usersCollection.countDocuments(filter, options);
    logger.debug(this.reqId, 'countUsers', STATES.SUCCEEDED);
    return { userCount };
  }

  public async fetchUsers(filter?: any, options?: any): Promise<{ users: any[] }> {
    logger.debug(this.reqId, 'fetchUsers', STATES.BEGUN);
    const cursor = await this.usersCollection.find(filter, options);
    const users = await cursor.toArray();
    logger.debug(this.reqId, 'fetchUsers', STATES.SUCCEEDED);
    return { users };
  }

  public async fetchUser(filter?: any, options?: any): Promise<{ user: any }> {
    logger.debug(this.reqId, 'fetchUser', STATES.BEGUN);
    const user = await this.usersCollection.findOne(filter, options);
    if (!user) {
      throw new Fail(404)
        .error({
          errorCode: ERROR_CODES.NOT_FOUND,
          keys: ['user'],
          message: 'User does not exist.',
        })
        .build();
    }
    logger.debug(this.reqId, 'fetchUser', STATES.SUCCEEDED);
    return { user };
  }

  public async addUser(username: string, email:string, password: string, name: string): Promise<{ userId: string }> {
    logger.debug(this.reqId, 'addUser', STATES.BEGUN);
    const salt = genSaltSync(config.SALT_ROUNDS);
    const saltedPassword = password = hashSync(password, salt);
    const user = this.userModel.newUser(username, email, saltedPassword, name);
    await this.usersCollection.insertOne(user);
    logger.debug(this.reqId, 'addUser', STATES.SUCCEEDED);
    return { userId: user.userId };
  }

  public async updateUser(filter: any, update: any): Promise<{}> {
    logger.debug(this.reqId, 'updateUser', STATES.BEGUN);
    if (update.password) {
      const salt = genSaltSync(config.SALT_ROUNDS);
      update.password = hashSync(update.password, salt);
    }
    if (Object.keys(update).length > 0) {
      update.modifiedOn = + Date.now();
    }
    await this.usersCollection.updateOne(filter, { $set: update });
    logger.debug(this.reqId, 'updateUser', STATES.SUCCEEDED);
    return {};
  }

  public async deleteUser(filter: any): Promise<{}> {
    logger.debug(this.reqId, 'deleteUser', STATES.BEGUN);
    await this.usersCollection.deleteOne(filter);
    logger.debug(this.reqId, 'deleteUser', STATES.SUCCEEDED);
    return {};
  }
}

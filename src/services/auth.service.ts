import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import { config } from '../config';
import { COLLECTIONS } from '../constants';
import {
  Logger,
  MongoCollection,
  MongoManager,
} from '../helpers';
import { Service } from '../helpers';
import { UserModel } from '../models';

const logger = new Logger('service', __filename);

export class AuthService extends Service {
  private userCollection: MongoCollection;

  constructor(
    private reqId: string,
    private mongo: MongoManager,
  ) {
    super(null);
    this.userCollection = this.mongo.collection(COLLECTIONS.USERS, new UserModel());
  }

  public async register(newUser: any): Promise<any> {
    logger.debug(this.reqId, 'register', 'begun');
    const filter = { username: newUser.username };
    const projection = { password: 0 };
    const existingUser = await this.userCollection.findOne(filter, { projection });
    if (existingUser) {
      this.fail = { username: 'User already exists.' };
      logger.debug(this.reqId, 'register', 'failed', this.fail);
      return;
    }
    const salt = bcrypt.genSaltSync(config.SALT_ROUNDS);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    newUser.createDate = + new Date();
    await this.userCollection.insertOne(newUser);
    const user = await this.userCollection.findOne(filter, { projection });
    logger.debug(this.reqId, 'register', 'succeeded');
    return user;
  }

  public async login(credentials: any): Promise<any> {
    logger.debug(this.reqId, 'login', 'begun');
    const filter = { username: credentials.username };
    const user = await this.userCollection.findOne(filter);
    if (!user) {
      this.fail = { username: 'User not found.' };
      logger.debug(this.reqId, 'login', 'failed', this.fail);
      return;
    }
    const isMatch = bcrypt.compareSync(credentials.password, user.password);
    if (!isMatch) {
      this.fail = { password: 'Password is incorrect.' };
      logger.debug(this.reqId, 'login', 'failed', this.fail);
      return;
    }
    const payload = { username: user.username };
    const bearerToken = jwt.sign(payload, config.BEARER_SECRET, { expiresIn: config.BEARER_TTL });
    const refreshToken = jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: config.REFRESH_TTL });
    logger.debug(this.reqId, 'login', 'succeeded');
    return {
      bearerToken,
      refreshToken,
    };
  }

  public async refresh(refreshToken: string): Promise<any> {
    logger.debug(this.reqId, 'refresh', 'begun');
    const refreshPayload: any = jwt.verify(refreshToken, config.REFRESH_SECRET);
    const filter = { username: refreshPayload.username };
    const user = await this.userCollection.findOne(filter);
    if (!user) {
      this.fail = { refreshToken: 'User not found.' };
      logger.debug(this.reqId, 'login', 'failed', this.fail);
      return;
    }
    const payload = { username: user.username };
    const bearerToken = jwt.sign(payload, config.BEARER_SECRET, { expiresIn: config.BEARER_TTL });
    const newRefreshToken = jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: config.REFRESH_TTL });
    logger.debug(this.reqId, 'refresh', 'succeeded');
    return {
      bearerToken,
      refreshToken: newRefreshToken,
    };
  }
}

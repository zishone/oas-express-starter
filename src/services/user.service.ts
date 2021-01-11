import { Database, FetchOptions, Filter } from '../helpers';
import { ERROR_CODES, ROLES } from '../constants';
import { User, UserModel } from '../models';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Logger } from '@zishone/logan';
import { compareSync } from 'bcryptjs';
import { config } from '../configs';
import httpError from 'http-errors';
import { sign } from 'jsonwebtoken';

export class UserService {
  private logger: Logger;
  private userModel: UserModel;

  constructor(logger: Logger, database: Database) {
    this.logger = logger;
    this.userModel = new UserModel(logger, database);
  }

  public async validatePassword(id: string, password: string): Promise<boolean> {
    this.logger.debugFunctionCall('UserService.validatePassword', arguments);
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 1 } });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw httpError(403, 'Credentials invalid', { errorCode: ERROR_CODES.NOT_ALLOWED });
    }
    return isMatch;
  }

  public async registerUser(username: string, email: string, password: string, name: string): Promise<{ user: User }> {
    this.logger.debugFunctionCall('UserService.registerUser', arguments);
    const salt = genSaltSync(12);
    const saltedPassword = hashSync(password, salt);
    const newUser = this.userModel.create(ROLES.USER, username, email, saltedPassword, name);
    const [id] = await this.userModel.save(newUser);
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 0 } });
    return { user };
  }

  public async authenticateUser(login: string, password: string): Promise<{ accessToken: string }> {
    try {
      this.logger.debugFunctionCall('UserService.authenticateUser', arguments);
      const { id } = await this.userModel.fetchOne(
        { $or: [{ username: login }, { email: login }] },
        { projection: { id: 1 } },
      );
      await this.validatePassword(id, password);
      const accessToken = sign({ id }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
      return { accessToken };
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        throw httpError(401, 'Credentials invalid', {
          errorCode: ERROR_CODES.UNAUTHENTICATED,
          details: error,
        });
      }
      throw error;
    }
  }

  public async fetchUserById(id: string, options?: FetchOptions<any>): Promise<{ user: User }> {
    this.logger.debugFunctionCall('UserService.fetchUserById', arguments);
    const user = await this.userModel.fetchOne({ id }, options);
    delete user.password;
    return { user };
  }

  public async fetchUsers(
    filter: Filter<User> = {},
    options: FetchOptions<any> = {},
  ): Promise<{ userCount: number; users: Partial<User>[] }> {
    this.logger.debugFunctionCall('UserService.fetchUsers', arguments);
    const cursor = await this.userModel.fetch(filter, options);
    const userCount = await cursor.count();
    const users = await cursor.toArray();
    for (const user of users) {
      delete user.password;
    }
    return {
      userCount,
      users,
    };
  }

  public async updateUserById(id: string, user: Partial<User>): Promise<void> {
    this.logger.debugFunctionCall('UserService.updateUserById', arguments);
    await this.userModel.fetchOne({ id });
    if (user.password) {
      const salt = genSaltSync(12);
      user.password = hashSync(user.password, salt);
    }
    await this.userModel.update({ id }, { $set: user });
  }

  public async deleteUserById(id: string): Promise<void> {
    this.logger.debugFunctionCall('UserService.deleteUserById', arguments);
    await this.userModel.fetchOne({ id });
    await this.userModel.delete({ id });
  }
}

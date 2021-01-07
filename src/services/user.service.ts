import { Database, FetchOptions, Filter } from '../helpers';
import { ERROR_CODES, ROLES } from '../constants';
import { User, UserModel } from '../models';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Logger } from '@zishone/logan';
import { compareSync } from 'bcryptjs';
import { config } from '../config';
import httpError from 'http-errors';
import { sign } from 'jsonwebtoken';

export class UserService {
  private logger: Logger;
  private userModel: UserModel;

  constructor(logger: Logger, database: Database) {
    this.logger = logger;
    this.userModel = new UserModel(logger, database);
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
    this.logger.debugFunctionCall('UserService.authenticateUser', arguments);
    const user = await this.userModel
      .fetchOne({
        $or: [{ username: login }, { email: login }],
      })
      .catch((error: any): void => {
        if (error.status === 404) {
          throw httpError(401, 'Credentials invalid', {
            errorCode: ERROR_CODES.UNAUTHENTICATED,
            details: error,
          });
        }
        throw error;
      });
    const isMatch = compareSync(password, (user as User).password);
    if (!isMatch) {
      throw httpError(401, 'Credentials invalid', { errorCode: ERROR_CODES.UNAUTHENTICATED });
    }
    const accessToken = sign({ id: (user as User).id }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
    return { accessToken };
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
    await this.userModel.update({ id }, { $set: user });
  }

  public async updateUserPasswordById(id: string, currentPassword: string, newPassword: string): Promise<void> {
    this.logger.debugFunctionCall('UserService.updateUserPasswordById', arguments);
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 1 } });
    const isMatch = compareSync(currentPassword, user.password);
    if (!isMatch) {
      throw httpError(403, 'Credentials invalid', { errorCode: ERROR_CODES.NOT_ALLOWED });
    }
    const salt = genSaltSync(12);
    const saltedNewPassword = hashSync(newPassword, salt);
    await this.userModel.update({ id }, { $set: { password: saltedNewPassword } });
  }

  public async deleteUserById(id: string): Promise<void> {
    this.logger.debugFunctionCall('UserService.deleteUserById', arguments);
    await this.userModel.fetchOne({ id });
    await this.userModel.delete({ id });
  }

  public async deleteUserByIdWithCredentials(id: string, password: string): Promise<void> {
    this.logger.debugFunctionCall('UserService.deleteUserByIdWithCredentials', arguments);
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 1 } });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw httpError(403, 'Credentials invalid', { errorCode: ERROR_CODES.NOT_ALLOWED });
    }
    await this.userModel.delete({ id });
  }
}

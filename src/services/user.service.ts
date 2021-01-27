import { ERROR_CODES, ROLES } from '../constants';
import { FetchOptions, Filter, logger } from '../helpers';
import { User, userModel } from '../models';
import { appConfig, envConfig } from '../configs';
import { genSaltSync, hashSync } from 'bcryptjs';
import { compareSync } from 'bcryptjs';
import httpError from 'http-errors';
import { sign } from 'jsonwebtoken';

export class UserService {
  public async validatePassword(id: string, password: string): Promise<boolean> {
    logger.debugFunctionCall('UserService.validatePassword', arguments);
    const user = await userModel.fetchOne({ id }, { projection: { password: 1 } });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw httpError(403, 'Credentials invalid', { errorCode: ERROR_CODES.NOT_ALLOWED });
    }
    return isMatch;
  }

  public async registerUser(username: string, email: string, password: string, name: string): Promise<{ user: User }> {
    logger.debugFunctionCall('UserService.registerUser', arguments);
    const salt = genSaltSync(appConfig.SALT_ROUNDS);
    const saltedPassword = hashSync(password, salt);
    const newUser = new User(ROLES.USER, username, email, saltedPassword, name);
    const [id] = await userModel.save(newUser);
    const user = await userModel.fetchOne({ id }, { projection: { password: 0 } });
    return { user };
  }

  public async authenticateUser(login: string, password: string): Promise<{ accessToken: string }> {
    try {
      logger.debugFunctionCall('UserService.authenticateUser', arguments);
      const { id } = await userModel.fetchOne(
        { $or: [{ username: login }, { email: login }] },
        { projection: { id: 1 } },
      );
      await this.validatePassword(id, password);
      const accessToken = sign({ id }, envConfig.LOGIN_SECRET, { expiresIn: envConfig.LOGIN_TTL });
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
    logger.debugFunctionCall('UserService.fetchUserById', arguments);
    const user = await userModel.fetchOne({ id }, options);
    delete user.password;
    return { user };
  }

  public async fetchUsers(
    filter: Filter<User> = {},
    options: FetchOptions<any> = {},
  ): Promise<{ userCount: number; users: Partial<User>[] }> {
    logger.debugFunctionCall('UserService.fetchUsers', arguments);
    const cursor = await userModel.fetch(filter, options);
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
    logger.debugFunctionCall('UserService.updateUserById', arguments);
    await userModel.fetchOne({ id });
    if (user.password) {
      const salt = genSaltSync(appConfig.SALT_ROUNDS);
      user.password = hashSync(user.password, salt);
    }
    await userModel.update({ id }, { $set: user });
  }

  public async deleteUserById(id: string): Promise<void> {
    logger.debugFunctionCall('UserService.deleteUserById', arguments);
    await userModel.fetchOne({ id });
    await userModel.delete({ id });
  }
}

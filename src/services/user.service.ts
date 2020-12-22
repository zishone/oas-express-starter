import {
  ERROR_CODES,
  ROLES,
} from '../constants';
import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '../helpers';
import {
  User,
  UserModel,
} from '../models';
import {
  genSaltSync,
  hashSync,
} from 'bcryptjs';
import { compareSync } from 'bcryptjs';
import { config } from '../config';
import httpError from 'http-errors';
import { sign } from 'jsonwebtoken';

export class UserService {
  private logger: Logger;
  private userModel: UserModel;

  constructor(logger: Logger, mongo: Mongo) {
    this.logger = logger;
    this.userModel = new UserModel(logger, mongo);
  }

  public async registerUser(username: string, email: string, password: string, name: string): Promise<{ user: User }> {
    const salt = genSaltSync(12);
    const saltedPassword = hashSync(password, salt);
    const newUser = this.userModel.create(ROLES.USER, username, email, saltedPassword, name);
    const [id] = await this.userModel.save(newUser);
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 0 } });
    return { user };
  }

  public async authenticateUser(login: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userModel.fetchOne({
      $or: [
        { username: login },
        { email: login },
      ],
    })
      .catch((error: any) => {
        if (error.statusCode === 404) {
          throw httpError(401, 'Credentials invalid', {
            errorCode: ERROR_CODES.UNAUTHENTICATED,
            details: error,
          });
        }
        throw error;
      });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw httpError(401, 'Credentials invalid', { errorCode: ERROR_CODES.UNAUTHENTICATED });
    }
    const accessToken = sign({ id: user.id }, config.LOGIN_SECRET, { expiresIn: config.LOGIN_TTL });
    return { accessToken };
  }

  public async fetchUserById(id: string, options?: FindOneOptions<any>): Promise<{ user: User }> {
    const user = await this.userModel.fetchOne({ id }, options);
    delete user.password;
    return { user };
  }

  public async fetchUsers(filter: FilterQuery<User> = {}, options: FindOneOptions<any> = {}): Promise<{ userCount: number, users: User[]}> {
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

  public async updateUserById(id: string, user: User): Promise<void> {
    await this.userModel.fetchOne({ id });
    await this.userModel.update({ id }, { $set: user });
  }

  public async updateUserPasswordById(id: string, currentPassword: string, newPassword: string): Promise<void> {
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
    await this.userModel.fetchOne({ id });
    await this.userModel.delete({ id });
  }

  public async deleteUserByIdWithCredentials(id: string, password: string): Promise<void> {
    const user = await this.userModel.fetchOne({ id }, { projection: { password: 1 } });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw httpError(403, 'Credentials invalid', { errorCode: ERROR_CODES.NOT_ALLOWED });
    }
    await this.userModel.delete({ id });
  }
}

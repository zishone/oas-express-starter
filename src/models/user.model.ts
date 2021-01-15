import { Data, Database, Model } from '../helpers';
import { IsOptional, IsString } from 'class-validator';
import { Logger } from '@zishone/logan';

export class User extends Data {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role: string;
}

export class UserModel extends Model<User> {
  static collectionName: string = 'users';

  constructor(logger: Logger, database: Database) {
    super(logger, database, UserModel.collectionName);
  }

  public create(role: string, username: string, email: string, saltedPassword: string, name: string): User {
    this.logger.debugFunctionCall('UserModel.create', arguments);
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = saltedPassword;
    user.name = name;
    user.role = role;
    return user;
  }
}

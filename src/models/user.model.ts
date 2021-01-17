import { IsOptional, IsString } from 'class-validator';
import { COLLECTIONS } from '../constants';
import { Data } from '.';
import { Model } from '../helpers';

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

  constructor(role: string, username: string, email: string, saltedPassword: string, name: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = saltedPassword;
    this.name = name;
    this.role = role;
  }
}

export const userModel = new Model<User>(COLLECTIONS.USERS);

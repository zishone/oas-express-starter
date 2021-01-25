import { COLLECTIONS, ROLES } from '../constants';
import { Data, Model } from '../helpers';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class User extends Data {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEnum(Object.values(ROLES))
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

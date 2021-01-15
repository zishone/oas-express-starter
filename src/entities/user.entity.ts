import { IsOptional, IsString } from 'class-validator';
import { Entity } from '.';

export class User extends Entity {
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

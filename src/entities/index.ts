import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Entity {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  modifiedOn: number;

  @IsOptional()
  @IsNumber()
  createdOn: number;
}

export * from './note.entity';
export * from './user.entity';

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Data {
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

export * from './note.model';
export * from './user.model';

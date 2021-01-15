import { Data, Database, Model } from '../helpers';
import { IsOptional, IsString } from 'class-validator';
import { COLLECTIONS } from '../constants';
import { Logger } from '@zishone/logan';

export class Note extends Data {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body: string;

  constructor(userId: string, title: string, body: string) {
    super();
    this.userId = userId;
    this.title = title;
    this.body = body;
  }
}
export class NoteModel extends Model<Note> {
  constructor(logger: Logger, database: Database) {
    super(logger, database, COLLECTIONS.NOTES);
  }
}

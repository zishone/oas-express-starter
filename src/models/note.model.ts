import { Data, Database, Model } from '../helpers';
import { IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsNumber()
  modifiedOn: number;
}

export class NoteModel extends Model<Note> {
  static collectionName: string = 'notes';

  constructor(logger: Logger, database: Database) {
    super(logger, database, NoteModel.collectionName);
  }

  public create(userId: string, title: string, body: string): Note {
    this.logger.debugFunctionCall('NoteModel.create', arguments);
    const note = {
      id: '',
      userId,
      title,
      body,
      modifiedOn: 0,
      createdOn: 0,
    };
    return note;
  }
}

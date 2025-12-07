import { Expose, Type } from 'class-transformer';
import { AuthorRdo } from '../../offer/rdo/common.rdo.js';

export class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public createdAt!: Date;

  @Expose({ name: 'userId' })
  @Type(() => AuthorRdo)
  public author!: AuthorRdo;
}

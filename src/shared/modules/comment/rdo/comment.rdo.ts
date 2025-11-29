import { Expose, Type } from 'class-transformer';

class AuthorRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public type!: string;
}

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

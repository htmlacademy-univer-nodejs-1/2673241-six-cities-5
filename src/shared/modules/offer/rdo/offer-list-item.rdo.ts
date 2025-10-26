import { Expose, Type } from 'class-transformer';
import { CityRdo } from './common.rdo.js';

export class OfferListItemRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public type!: string;

  @Expose()
  public price!: number;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public postDate!: Date;
}

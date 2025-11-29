import { Expose, Type } from 'class-transformer';
import { CityRdo, LocationRdo, AuthorRdo } from './common.rdo.js';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: string;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: string[];

  @Expose({ name: 'authorId' })
  @Type(() => AuthorRdo)
  public author!: AuthorRdo;

  @Expose()
  public commentsCount!: number;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}

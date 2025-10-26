import { City, HousingType } from '../../../types/index.js';

export class OfferListItemDto {
  public id!: string;
  public title!: string;
  public type!: HousingType;
  public price!: number;
  public city!: City;
  public previewImage!: string;
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public rating!: number;
  public commentsCount!: number;
  public postDate!: Date;
}

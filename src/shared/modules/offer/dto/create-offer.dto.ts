import { Good, City, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public type!: HousingType;
  public rating!: number;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Good[];
  public authorId!: string;
  public commentsCount!: number;
  public latitude!: number;
  public longitude!: number;
}


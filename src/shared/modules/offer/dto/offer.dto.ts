import { City, HousingType, Good } from '../../../types/index.js';
import { UserDto } from '../../user/dto/user.dto.js';

export class OfferDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: HousingType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Good[];
  public author!: UserDto;
  public commentsCount!: number;
  public location!: {
    latitude: number;
    longitude: number;
  };
}


import { City, HousingType, Good } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: HousingType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Good[];
  public location?: {
    latitude: number;
    longitude: number;
  };
}


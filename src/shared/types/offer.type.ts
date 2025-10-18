import { CITIES, HOUSING_TYPE, GOODS } from '../constants/app.constants.js';
import { User } from './user.type.js';

export type City = typeof CITIES[number];
export type HousingType = typeof HOUSING_TYPE[number];
export type Good = typeof GOODS[number];

export function isKey<T extends string>(str: string, array: Readonly<Array<T>>): T | undefined {
  return array.find((val) => val === str);
}

export function findCity(cityName: string): City | undefined {
  return CITIES.find((city) => city.name === cityName);
}

export interface Offer {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Good[];
  author: User;
  commentsCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
}


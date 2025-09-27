import { CITIES, HOUSING_TYPE, GOODS } from '../constants/app.constants.js';

export type City = typeof CITIES[number];
export type HousingType = typeof HOUSING_TYPE[number];
export type Good = typeof GOODS[number];

export function isKey<A extends string>(str: string, array: Readonly<Array<A>>): A | undefined {
  const foundKey = array.find((val) => val === str);

  if (!foundKey) {
    return;
  }

  return foundKey;
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
  author: string;
  commentsCount: number;
  latitude: number;
  longitude: number;
}

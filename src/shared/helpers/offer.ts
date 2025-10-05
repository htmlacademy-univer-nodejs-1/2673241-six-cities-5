import { Offer } from '../types/index.js';
import { CITIES, GOODS, HOUSING_TYPE } from '../constants/app.constants.js';
import { isKey, findCity } from '../types/offer.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    author,
    commentsCount,
    latitude,
    longitude
  ] = offerData.replace('\r\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: findCity(city) ?? CITIES[0],
    previewImage,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: isKey(type, HOUSING_TYPE) ?? HOUSING_TYPE[0],
    bedrooms: parseInt(bedrooms, 10),
    maxAdults: parseInt(maxAdults, 10),
    price: parseInt(price, 10),
    goods: goods.split(';')
      .map((g) => isKey(g, GOODS))
      .filter((item): item is typeof GOODS[number] => item !== undefined),
    author,
    commentsCount: parseInt(commentsCount, 10),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
}

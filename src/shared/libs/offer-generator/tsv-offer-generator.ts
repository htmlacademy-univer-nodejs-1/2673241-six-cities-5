import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  getRandomBoolean,
  generateRandomCoordinate
} from '../../helpers/index.js';
import {
  CITIES,
  GOODS,
  HOUSING_TYPE,
  MIN_PRICE,
  MAX_PRICE,
  MIN_RATING,
  MAX_RATING,
  MIN_ROOMS,
  MAX_ROOMS,
  MIN_ADULTS,
  MAX_ADULTS,
  MIN_COMMENTS,
  MAX_COMMENTS,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY
} from '../../constants/app.constants.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles).toString();
    const description = getRandomItem<string>(this.mockData.descriptions).toString();
    const randomCity = getRandomItem([...CITIES]);
    const city = randomCity.name.toString();
    const previewImage = getRandomItem<string>(this.mockData.images).toString();
    const imageCount = generateRandomValue(3, 6);
    const images = Array.from(
      { length: imageCount },
      () => getRandomItem<string>(this.mockData.images)
    ).join(';');
    const isPremium = getRandomBoolean().toString();
    const isFavorite = getRandomBoolean().toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const type = getRandomItem([...HOUSING_TYPE]).toString();
    const bedrooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const selectedGoods = getRandomItems([...GOODS]).join(';');
    const author = getRandomItem<string>(this.mockData.emails).toString();
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const randomCoordinates = generateRandomCoordinate(city);
    const coordinates = { latitude: randomCoordinates.latitude.toString(), longitude: randomCoordinates.longitude.toString() };
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
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
      selectedGoods,
      author,
      commentsCount,
      coordinates.latitude,
      coordinates.longitude,
    ].join('\t');
  }
}

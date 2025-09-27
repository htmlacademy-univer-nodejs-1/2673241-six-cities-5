import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, isKey } from '../../types/index.js';
import { CITIES, HOUSING_TYPE, GOODS } from '../../constants/app.constants.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, cityName, previewImage, images, isPremium, isFavorite, rating, type, bedrooms, maxAdults, price, goods, author, commentsCount, latitude, longitude]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: isKey(cityName, CITIES) ?? CITIES[0],
        previewImage,
        images: images.split(';'),
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: parseFloat(rating),
        type: isKey(type, HOUSING_TYPE) ?? HOUSING_TYPE[0],
        bedrooms: parseInt(bedrooms, 10),
        maxAdults: parseInt(maxAdults, 10),
        price: parseInt(price, 10),
        goods: goods.split(';').map((g) => isKey(g, GOODS) ?? GOODS[0]),
        author,
        commentsCount: parseInt(commentsCount, 10),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      }));
  }
}

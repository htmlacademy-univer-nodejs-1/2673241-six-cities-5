import { CITIES } from '../constants/app.constants.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function generateRandomCoordinate(cityName?: string): { latitude: number; longitude: number } {
  const city = cityName
    ? CITIES.find((c) => c.name === cityName) || getRandomItem([...CITIES])
    : getRandomItem([...CITIES]);
  return {
    latitude: city.latitude + generateRandomValue(-0.008, 0.008, 6),
    longitude: city.longitude + generateRandomValue(-0.008, 0.008, 6),
  };
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

/* в тз (3.1.1.) требуется имя до 15 символов, поэтому сделал, чтобы всегда было "И. Фамилия" */
export function shortenName(fullName: string): string {
  const parts = fullName.trim().split(' ');

  if (parts.length < 2) {
    return fullName.substring(0, 15);
  }

  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return `${firstName[0]}. ${lastName}`;
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

import { CITIES } from '../constants/app.constants.js';

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

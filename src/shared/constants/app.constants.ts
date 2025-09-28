export const CITIES = [
  {
    name: 'Paris',
    latitude: 48.85661,
    longitude: 2.351499
  },
  {
    name: 'Cologne',
    latitude: 50.938361,
    longitude: 6.959974
  },
  {
    name: 'Brussels',
    latitude: 50.846557,
    longitude: 4.351697
  },
  {
    name: 'Amsterdam',
    latitude: 52.370216,
    longitude: 4.895168
  },
  {
    name: 'Hamburg',
    latitude: 53.550341,
    longitude: 10.000654
  },
  {
    name: 'Dusseldorf',
    latitude: 51.225402,
    longitude: 6.776314
  }
] as const;

export const HOUSING_TYPE = ['apartment', 'house', 'room', 'hotel'] as const;

export const GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;

export const USER_TYPE = ['обычный', 'pro'] as const;

export const MIN_PRICE = 1000;
export const MAX_PRICE = 100000;

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export const MIN_ROOMS = 1;
export const MAX_ROOMS = 8;

export const MIN_ADULTS = 1;
export const MAX_ADULTS = 10;

export const MIN_COMMENTS = 0;
export const MAX_COMMENTS = 20;

export const FIRST_WEEK_DAY = 1;
export const LAST_WEEK_DAY = 7;

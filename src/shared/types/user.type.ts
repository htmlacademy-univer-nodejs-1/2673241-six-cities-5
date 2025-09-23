import { USER_TYPE } from '../constants/app.constants.js';
export type UserType = typeof USER_TYPE[number];

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
}

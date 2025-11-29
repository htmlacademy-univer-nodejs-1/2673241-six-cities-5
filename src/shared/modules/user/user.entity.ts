import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { USER_TYPE, MIN_NAME_LENGTH, MAX_NAME_LENGTH } from '../../constants/app.constants.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

const DEFAULT_AVATAR_PATH = '/static/default-avatar.jpg';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: [MIN_NAME_LENGTH, 'Name must be at least 1 character long'],
    maxlength: [MAX_NAME_LENGTH, 'Name cannot exceed 15 characters'],
    trim: true,
    type: () => String
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    trim: true,
    type: () => String
  })
  public email!: string;

  @prop({
    required: false,
    default: DEFAULT_AVATAR_PATH,
    match: [/\.(jpg|png)$/i, 'Avatar must be a JPG or PNG image'],
    type: () => String
  })
  public avatarUrl?: string;

  @prop({
    required: true,
    type: () => String
  })
  public password!: string;

  @prop({
    required: true,
    enum: USER_TYPE,
    default: USER_TYPE[0],
    type: () => String
  })
  public type!: UserType;

  @prop({
    required: false,
    default: [],
    ref: 'OfferEntity',
    type: () => [String]
  })
  public favorites!: Ref<string>[];

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl || DEFAULT_AVATAR_PATH;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hash = createSHA256(password, salt);
    return this.password === hash;
  }

  public getAvatarUrl() {
    return this.avatarUrl || DEFAULT_AVATAR_PATH;
  }
}

export const UserModel = getModelForClass(UserEntity);

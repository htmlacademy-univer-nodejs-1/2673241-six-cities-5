import { defaultClasses, getModelForClass, modelOptions, prop, Ref, PropType } from '@typegoose/typegoose';
import { Good, City, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import {
  HOUSING_TYPE,
  GOODS,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_RATING,
  MAX_RATING,
  MIN_ROOMS,
  MAX_ROOMS,
  MIN_ADULTS,
  MAX_ADULTS,
  MIN_PRICE,
  MAX_PRICE,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE
} from '../../constants/app.constants.js';

export class CitySchema {
  @prop({ required: true, type: () => String })
  public name!: string;

  @prop({ required: true, type: () => Number, min: MIN_LATITUDE, max: MAX_LATITUDE })
  public latitude!: number;

  @prop({ required: true, type: () => Number, min: MIN_LONGITUDE, max: MAX_LONGITUDE })
  public longitude!: number;
}


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(_doc, ret) {
        delete ret._id;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function(_doc, ret) {
        delete ret._id;
        return ret;
      }
    }
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: MIN_TITLE_LENGTH,
    maxlength: MAX_TITLE_LENGTH,
    trim: true,
    type: () => String
  })
  public title!: string;

  @prop({
    required: true,
    minlength: MIN_DESCRIPTION_LENGTH,
    maxlength: MAX_DESCRIPTION_LENGTH,
    trim: true,
    type: () => String
  })
  public description!: string;

  @prop({
    required: true,
    default: Date.now,
    type: () => Date
  })
  public postDate!: Date;

  @prop({
    required: true,
    type: () => CitySchema,
    _id: false
  })
  public city!: City;

  @prop({
    required: true,
    match: [/\.(jpg|png)$/i, 'Preview image must be a JPG or PNG image'],
    type: () => String
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => String
  }, PropType.ARRAY)
  public images!: string[];

  @prop({
    required: true,
    default: false,
    type: () => Boolean
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    default: false,
    type: () => Boolean
  })
  public isFavorite!: boolean;

  @prop({
    required: true,
    min: MIN_RATING,
    max: MAX_RATING,
    default: 1,
    type: () => Number
  })
  public rating!: number;

  @prop({
    required: true,
    enum: HOUSING_TYPE,
    validate: {
      validator: (v: string) => HOUSING_TYPE.includes(v as typeof HOUSING_TYPE[number]),
      message: 'Invalid place type'
    },
    type: () => String
  })
  public type!: HousingType;

  @prop({
    required: true,
    min: MIN_ROOMS,
    max: MAX_ROOMS,
    type: () => Number
  })
  public bedrooms!: number;

  @prop({
    required: true,
    min: MIN_ADULTS,
    max: MAX_ADULTS,
    type: () => Number
  })
  public maxAdults!: number;

  @prop({
    required: true,
    min: MIN_PRICE,
    max: MAX_PRICE,
    type: () => Number
  })
  public price!: number;

  @prop({
    required: true,
    enum: GOODS,
    type: () => String,
    validate: {
      validator: (v: Good[]) => v.length > 0 && v.every((a) => GOODS.includes(a as typeof GOODS[number])),
      message: 'At least one amenity must be provided'
    }
  }, PropType.ARRAY)
  public goods!: Good[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public authorId!: Ref<UserEntity>;

  @prop({
    required: true,
    default: 0,
    type: () => Number
  })
  public commentsCount!: number;

  @prop({
    required: true,
    min: MIN_LATITUDE,
    max: MAX_LATITUDE,
    type: () => Number
  })
  public latitude!: number;

  @prop({
    required: true,
    min: MIN_LONGITUDE,
    max: MAX_LONGITUDE,
    type: () => Number
  })
  public longitude!: number;
}

export const OfferModel = getModelForClass(OfferEntity);


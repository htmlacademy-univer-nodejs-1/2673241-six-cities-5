import {
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HousingType, Good } from '../../../types/index.js';
import { HOUSING_TYPE, GOODS } from '../../../constants/app.constants.js';

class CityDto {
  @IsString()
  public name!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  public latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  public longitude!: number;
}

class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  public latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @MinLength(10, { message: 'Title must be at least 10 characters' })
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  public title!: string;

  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  @MaxLength(1024, { message: 'Description must be at most 1024 characters' })
  public description!: string;

  @ValidateNested()
  @Type(() => CityDto)
  public city!: CityDto;

  @IsString()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6, { message: 'Images must contain exactly 6 items' })
  @ArrayMaxSize(6, { message: 'Images must contain exactly 6 items' })
  @IsString({ each: true })
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(HOUSING_TYPE, { message: 'Invalid housing type' })
  public type!: HousingType;

  @IsInt()
  @Min(1, { message: 'Bedrooms must be at least 1' })
  @Max(8, { message: 'Bedrooms must be at most 8' })
  public bedrooms!: number;

  @IsInt()
  @Min(1, { message: 'Max adults must be at least 1' })
  @Max(10, { message: 'Max adults must be at most 10' })
  public maxAdults!: number;

  @IsInt()
  @Min(100, { message: 'Price must be at least 100' })
  @Max(100000, { message: 'Price must be at most 100000' })
  public price!: number;

  @IsArray()
  @IsEnum(GOODS, { each: true, message: 'Invalid amenity' })
  @ArrayMinSize(1, { message: 'At least one amenity is required' })
  public goods!: Good[];

  public authorId?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}



import { IsString, IsEmail, IsEnum, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { USER_TYPE } from '../../../constants/app.constants.js';

export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @MaxLength(15, { message: 'Name must be at most 15 characters' })
  public name!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  public email!: string;

  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|png)$/i, { message: 'Avatar must be a JPG or PNG image' })
  public avatarUrl?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(12, { message: 'Password must be at most 12 characters' })
  public password!: string;

  @IsEnum(USER_TYPE, { message: 'Invalid user type' })
  public type!: UserType;
}

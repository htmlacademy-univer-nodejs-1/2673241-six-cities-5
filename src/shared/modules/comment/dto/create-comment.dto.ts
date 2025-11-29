import { IsString, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5, { message: 'Comment must be at least 5 characters' })
  @MaxLength(1024, { message: 'Comment must be at most 1024 characters' })
  public text!: string;

  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  public rating!: number;

  public offerId!: string;
  public userId!: string;
}

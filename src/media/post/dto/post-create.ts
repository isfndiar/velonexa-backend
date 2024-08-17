import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class PostCreateDto {
  @IsString()
  @Length(0, 255)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      throw new Error('Invalid tags format');
    }
  })
  tags?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  images?: Express.Multer.File[];
}

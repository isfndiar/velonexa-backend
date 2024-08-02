import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

enum Gender {
  Male = 'male',
  Female = 'female',
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Length(6, 20)
  username?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  bio?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either male or female' })
  gender?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('ID', {
    message: 'Phone number must be a valid phone number in Indonesia',
  })
  @Length(10, 13, { message: 'Phone number must be between 10 and 13 digits' })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(8, 30)
  password?: string;
}

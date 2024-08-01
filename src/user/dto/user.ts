import { IsEmail, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @Length(6, 20)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @Length(8, 30)
  confirmPassword: string;
}

export class UserLoginDto {
  @IsString()
  username: string;

  @IsString()
  @Length(8, 30)
  password: string;
}

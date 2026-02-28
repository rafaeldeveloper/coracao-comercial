import { IsEmail, IsString } from 'class-validator';

export class BusinessLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

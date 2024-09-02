import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

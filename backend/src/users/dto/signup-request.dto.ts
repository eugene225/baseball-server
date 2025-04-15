import { IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class SignUpRequestDto {
  @IsEmail({}, { message: '올바르지 않은 이메일 형식입니다.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: '비밀번호는 영어 대소문자+숫자 8자 이상'
  })
  password: string;

  @IsString()
  @MinLength(2, { message: '닉네임은 2~10자 이어야 합니다.' })
  @MaxLength(10, { message: '닉네임은 2~10자 이어야 합니다.' })
  nickname: string;
}

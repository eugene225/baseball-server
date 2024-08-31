export class SignInResponseDto {
  constructor(
    public readonly email: string,
    public readonly accessToken: string,
  ) {}

  static create(email: string, accessToken: string): SignInResponseDto {
    return new SignInResponseDto(email, accessToken);
  }
}

export class SignInResponseDto {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly accessToken: string,
  ) {}

  static create(
    userId: number,
    email: string,
    accessToken: string,
  ): SignInResponseDto {
    return new SignInResponseDto(userId, email, accessToken);
  }
}

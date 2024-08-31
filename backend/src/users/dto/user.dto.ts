import { User } from '../domain/user.entity';

export class UserDto {
  constructor(
    public readonly id: number,
    public readonly nickname: string,
    public readonly email: string,
  ) {}

  static create(user: User): UserDto {
    return new UserDto(user.id, user.nickname, user.email);
  }
}

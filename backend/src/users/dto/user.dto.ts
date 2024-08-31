import { User } from '../domain/user.entity';

export class UserDto {
  id: number;
  nickname: string;
  email: string;

  static create(user: User) {
    const dto = new UserDto();
    dto.id = user.id;
    dto.nickname = user.nickname;
    dto.email = user.email;

    return dto;
  }
}

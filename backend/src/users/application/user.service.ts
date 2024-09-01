import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getById(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: userId });

    return UserDto.create(user);
  }
}

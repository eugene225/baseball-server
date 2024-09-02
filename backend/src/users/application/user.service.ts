import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository';
import { UserDto } from '../dto/user.dto';
import { UpdateUserInfoRequest } from '../dto/updateInfo-request.dto';

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

  async updateInfo(
    userId: number,
    request: UpdateUserInfoRequest,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.updateInfo(request.nickname, request.myTeam);

    await this.userRepository.save(user);

    return UserDto.create(user);
  }
}

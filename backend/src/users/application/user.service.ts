import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository.js';
import { UserDto } from '../dto/user.dto.js';
import { UpdateUserInfoRequest } from '../dto/update-info-request.dto.js';

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

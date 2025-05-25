import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository.js';
import { UserDto } from '../dto/user.dto.js';
import { UpdateUserInfoRequest } from '../dto/update-info-request.dto.js';
import { Transactional } from 'typeorm-transactional';
import { ReadOnlyTransactional } from '../../global/decorator/custom-transaction.decorator.js';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @ReadOnlyTransactional()
  async getById(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: userId });

    return UserDto.create(user);
  }

  @Transactional()
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

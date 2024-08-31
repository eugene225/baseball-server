import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(singUpRequestDto: SignUpRequestDto): Promise<User> {
    const { nickname, email, password } = singUpRequestDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ nickname, email, password: hashedPassword });

    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing Email');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

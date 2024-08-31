import { UserRepository } from './../domain/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import { UserDto } from '../dto/user.dto';

export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<UserDto> {
    const user = await this.userRepository.createUser(signUpRequestDto);
    return UserDto.create(user);
  }
}

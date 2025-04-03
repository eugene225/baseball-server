import { UserRepository } from './../domain/user.repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from '../dto/signup-request.dto.js';
import { UserDto } from '../dto/user.dto.js';
import { SignInRequestDto } from '../dto/signIn-request.dto.js';
import { SignInResponseDto } from '../dto/signIn-response.dto.js';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
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

  async singIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const { email, password } = signInRequestDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return SignInResponseDto.create(user.id, email, accessToken);
    } else {
      throw new UnauthorizedException('login failed - email {}', email);
    }
  }
}

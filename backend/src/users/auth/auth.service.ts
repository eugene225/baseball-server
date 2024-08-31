import { UserRepository } from './../domain/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import { UserDto } from '../dto/user.dto';
import { SignInRequestDto } from '../dto/signIn-request.dto';
import { SignInResponseDto } from '../dto/signIn-response.dto';
import * as bcrypt from 'bcryptjs';
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
      return SignInResponseDto.create(email, accessToken);
    } else {
      throw new UnauthorizedException('login failed - email {}', email);
    }
  }
}

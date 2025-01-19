import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { SignUpRequestDto } from '../dto/signup-request.dto.js';
import { UserDto } from '../dto/user.dto.js';
import { SignInResponseDto } from '../dto/signIn-response.dto.js';
import { SignInRequestDto } from '../dto/signIn-request.dto.js';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<UserDto> {
    const userDto = await this.authService.signUp(signUpRequestDto);
    return userDto;
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const signInResponse = await this.authService.singIn(signInRequestDto);
    return signInResponse;
  }
}

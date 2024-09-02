import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import { UserDto } from '../dto/user.dto';
import { SignInResponseDto } from '../dto/signIn-response.dto';
import { SignInRequestDto } from '../dto/signIn-request.dto';

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
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const signInResponse = await this.authService.singIn(signInRequestDto);
    return signInResponse;
  }
}

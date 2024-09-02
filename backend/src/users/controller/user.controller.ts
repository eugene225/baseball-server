import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserDto } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserInfoRequest } from '../dto/updateInfo-request.dto';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseGuards(AuthGuard())
  async getById(@Param('userId') userId: number): Promise<UserDto> {
    return this.userService.getById(userId);
  }

  @Patch(':userId')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async update(
    @Param('userId') userId: number,
    @Body() request: UpdateUserInfoRequest,
  ): Promise<UserDto> {
    return this.userService.updateInfo(userId, request);
  }
}

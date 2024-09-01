import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserDto } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseGuards(AuthGuard())
  async getById(@Param('userId') userId: number): Promise<UserDto> {
    return this.userService.getById(userId);
  }
}

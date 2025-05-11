import { FcmService } from '../application/fcm.service.js';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { SaveFcmTokenDto, FcmTokenResponseDto } from '../dto/fcm-token.dto.js';

@Controller('/v1/fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {
  }

  @Post('/token')
  async saveFcmToken(
    @Body() saveFcmTokenDto: SaveFcmTokenDto,
  ): Promise<FcmTokenResponseDto> {
    return await this.fcmService.updateFcmToken(
      saveFcmTokenDto.userId,
      saveFcmTokenDto.fcmToken,
      saveFcmTokenDto.deviceType
    );
  }

  @Get('/token')
  async getFcmToken(
    @Query('userId') userId: number,
    @Query('deviceType') deviceType: string,
  ): Promise<FcmTokenResponseDto> {
    return await this.fcmService.getFcmToken(userId, deviceType);
  }

  @Delete('/token')
  async deleteFcmToken(
    @Query('userId') userId: number,
    @Query('deviceType') deviceType: string,
  ): Promise<void> {
    await this.fcmService.deleteFcmToken(userId, deviceType);
  }
}
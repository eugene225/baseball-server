import { FcmService } from '../application/fcm.service.js';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('/v1/fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {
  }

  @Post('/:userId/fcm-token')
  async saveFcmToken(
    @Param('userId') userId: number,
    @Body('fcmToken') fcmToken: string,
  ) {
    await this.fcmService.updateFcmToken(userId, fcmToken);
  }

  @Get('/:userId/fcm-token')
  async getFcmToken(@Param('userId') userId: number) {
    return await this.fcmService.getFcmToken(userId);
  }

  @Delete('/:userId/fcm-token')
  async deleteFcmToken(
    @Param('userId') userId: number,
  ) {
    await this.fcmService.deleteFcmToken(userId);
  }
}
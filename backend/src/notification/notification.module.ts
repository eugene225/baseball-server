import { Module } from '@nestjs/common';
import { FcmService } from './application/fcm.service.js';
import { FcmController } from './controller/fcm.controller.js';
import { FcmInfoRepository } from './entity/fcmInfo.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmInfo } from './entity/fcmInfo.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([FcmInfo]),
  ],
  controllers: [FcmController],
  providers: [FcmService, FcmInfoRepository]
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { FcmService } from './application/fcm.service.js';
import { FcmController } from './controller/fcm.controller.js';
import { FcmInfoRepository } from './entity/fcmInfo.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmInfo } from './entity/fcmInfo.entity.js';
import { User } from '../users/domain/user.entity.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([FcmInfo, User]),
    UsersModule
  ],
  controllers: [FcmController],
  providers: [FcmService, FcmInfoRepository]
})
export class NotificationModule {}

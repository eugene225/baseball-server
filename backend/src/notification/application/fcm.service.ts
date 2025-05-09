import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmInfoRepository } from '../entity/fcmInfo.repository.js';
import admin from '../../configs/firebase-admin.js';
import { FcmMessageDto } from '../dto/fcm-message.dto.js';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(FcmInfoRepository)
    private readonly fcmInfoRepository: FcmInfoRepository,
  ) {}

  async updateFcmToken(userId: number, fcmToken: string) {
    const fcmInfo = await this.fcmInfoRepository.findByUserId(userId);
    await this.fcmInfoRepository.updateByUserId(userId, fcmToken);
  }

  async deleteFcmToken(userId: number) {
    await this.fcmInfoRepository.updateByUserId(userId, null);
  }

  async sendNotificationToUser(userId: number, title: string, body: string) {
    const fcmInfo = await this.fcmInfoRepository.findByUserId(userId);
    if (!fcmInfo || !fcmInfo.fcmToken) {
      console.log("FCM 토큰이 없어 알림을 전송할 수 없습니다.");
    }

    const message = FcmMessageDto.fromFcmInfo(fcmInfo, title, body);
    try {
      const response = await admin.messaging().send(message);
      console.log('알림 전송 성공:', response);
    } catch (err) {
      console.error('알림 전송 실패:', err);
      throw err;
    }
  }

}
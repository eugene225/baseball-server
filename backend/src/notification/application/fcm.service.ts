import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmInfo } from '../entity/fcmInfo.entity.js';
import { FcmInfoRepository } from '../entity/fcmInfo.repository.js';
import admin from '../../configs/firebase-admin.js';
import { FcmTokenResponseDto } from '../dto/fcm-token.dto.js';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(FcmInfoRepository)
    private readonly fcmInfoRepository: FcmInfoRepository,
  ) {}

  async getNotificationOnUsers(): Promise<FcmTokenResponseDto[]> {
    const fcmInfos = await this.fcmInfoRepository.findAllFcmTokenIsNotNull();
    return fcmInfos.map(info => ({
      id: info.id,
      fcmToken: info.fcmToken,
      deviceType: info.deviceType,
      userId: info.user.id
    }));
  }

  async getFcmToken(userId: number, deviceType: string): Promise<FcmTokenResponseDto> {
    const fcmInfo = await this.fcmInfoRepository.findByUserIdAndDeviceType(userId, deviceType);
    if (!fcmInfo) {
      return {
        userId: userId,
        fcmToken: null,
        deviceType: deviceType,
        id: null
      }
    }
    return {
      id: fcmInfo.id,
      fcmToken: fcmInfo.fcmToken,
      deviceType: fcmInfo.deviceType,
      userId: fcmInfo.user.id
    };
  }

  async updateFcmToken(userId: number, fcmToken: string, deviceType: string): Promise<FcmTokenResponseDto> {
    try {
      const fcmInfo = await this.fcmInfoRepository.updateByUserIdAndDeviceType(userId, fcmToken, deviceType);
      console.log('FCM 토큰 DB 저장 완료');
      return {
        id: fcmInfo.id,
        fcmToken: fcmInfo.fcmToken,
        deviceType: fcmInfo.deviceType,
        userId: fcmInfo.user.id
      };
    } catch (error) {
      console.error('FCM 토큰 저장 실패:', error);
      throw error;
    }
  }

  async deleteFcmToken(userId: number, deviceType: string): Promise<void> {
    try {
      await this.fcmInfoRepository.deleteByUserIdAndDeviceType(userId, deviceType);
      console.log('FCM 토큰 DB 삭제 완료');
    } catch (error) {
      console.error('FCM 토큰 삭제 실패:', error);
      throw error;
    }
  }

  async sendMulticastNotification(tokens: string[], title: string, body: string): Promise<void> {
    if (!tokens || tokens.length === 0) {
      console.log("전송할 FCM 토큰이 없습니다.");
      return;
    }

    const message = {
      data: {
        title,
        body,
        url: "https://haengbokza.site/target-page/chat",
        icon: "/alarm-logo.png",
      },
      tokens,
    };
  
    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`알림 전송 결과:`, {
        total: tokens.length,
        success: response.successCount,
        failure: response.failureCount
      });
  
      const failedTokens: string[] = [];
  
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const failedToken = tokens[idx];
          console.error(`토큰 전송 실패:`, {
            token: failedToken,
            error: resp.error,
            code: resp.error?.code,
            details: resp.error?.message
          });
          failedTokens.push(failedToken);
        }
      });
      
      if (failedTokens.length > 0) {
        await this.fcmInfoRepository.deleteTokens(failedTokens);
      }
    } catch (err) {
      console.error('멀티캐스트 전송 실패:', err);
      throw err;
    }
  }
}
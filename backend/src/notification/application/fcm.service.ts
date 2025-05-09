import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmInfoRepository } from '../entity/fcmInfo.repository.js';
import admin from '../../configs/firebase-admin.js';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(FcmInfoRepository)
    private readonly fcmInfoRepository: FcmInfoRepository,
  ) {}

  async getNotificationOnUsers() {
    return await this.fcmInfoRepository.findAllFcmTokenIsNotNull();
  }

  async getFcmToken(userId: number) {
    return await this.fcmInfoRepository.findByUserId(userId);
  }

  async updateFcmToken(userId: number, fcmToken: string) {
    try {
      await this.fcmInfoRepository.updateByUserId(userId, fcmToken);
      console.log('FCM 토큰 DB 저장 완료');
    } catch (error) {
      console.error('FCM 토큰 저장 실패:', error);
      throw error;
    }
  }

  async deleteFcmToken(userId: number) {
    try {
      await this.fcmInfoRepository.updateByUserId(userId, null);
      console.log('FCM 토큰 DB 삭제 완료');
    } catch (error) {
      console.error('FCM 토큰 삭제 실패:', error);
      throw error;
    }
  }

  async sendMulticastNotification(tokens: string[], title: string, body: string) {
    if (!tokens || tokens.length === 0) {
      console.log("전송할 FCM 토큰이 없습니다.");
      return;
    }

    const message = {
      notification: {
        title,
        body,
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
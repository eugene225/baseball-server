import { Injectable } from "@nestjs/common";
import { FcmService } from "../../notification/application/fcm.service.js";

@Injectable()
export class ChatNotificationTracker {
  constructor(private readonly fcmService: FcmService) {}

  async sendFirstUserNotification(room: string, nickname: string) {
    const fcmInfo = await this.fcmService.getNotificationOnUsers();
  
    const tokens = fcmInfo
      .map(info => info.fcmToken)
      .filter(token => !!token);
    
    console.log(tokens);
  
    const chunkSize = 100;
    const title = '채팅방에 첫 누군가 입장했습니다!';
    const body = `${nickname}님이 ${room} 채팅방에 최초로 입장했습니다.`;
  
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      await this.fcmService.sendMulticastNotification(chunk, title, body);
    }
  }  
}
  
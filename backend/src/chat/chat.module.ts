import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway.js';
import { ChatNotificationTracker } from './utils/chat.notification.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [NotificationModule],
  providers: [ChatGateway, ChatNotificationTracker]
})
export class ChatModule {}

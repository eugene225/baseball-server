import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config.mjs';
import { dirname, join } from 'path';
import { DiaryModule } from './diary/diary.module.js';
import { PlayerModule } from './player/player.module.js';
import { fileURLToPath } from 'url';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './global/filter/httpException.filter.js';
import { ChatModule } from './chat/chat.module.js';
import { NotificationModule } from './notification/notification.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    DiaryModule,
    PlayerModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}

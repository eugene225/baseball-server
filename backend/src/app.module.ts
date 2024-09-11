import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DiaryModule } from './diary/diary.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DiaryModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

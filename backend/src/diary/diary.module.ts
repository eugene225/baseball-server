import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './domain/diary.entity.js';
import { DiaryRepository } from './domain/diary.repository.js';
import { DiaryService } from './application/diary.service.js';
import { UserService } from '../users/application/user.service.js';
import { UserRepository } from '../users/domain/user.repository.js';
import { PassportModule } from '@nestjs/passport';
import { DiaryEntry } from './domain/diary-entry.entity.js';
import { DiaryEntryRepository } from './domain/diary-entry.repository.js';
import { DiaryEntryService } from './application/diary-entry.service.js';
import { PlayerRepository } from '../player/domain/player.repository.js';
import { Player } from '../player/domain/player.entity.js';
import { DiaryEntryLineUp } from './domain/diary-entry-lineup.entity.js';
import { DiaryEntryLineUpRepository } from './domain/diary-entry-lineup.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, DiaryEntry, Player, DiaryEntryLineUp]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DiaryController],
  providers: [
    DiaryRepository,
    UserRepository,
    DiaryService,
    UserService,
    DiaryEntryRepository,
    DiaryEntryService,
    PlayerRepository,
    DiaryEntryLineUpRepository,
  ],
})
export class DiaryModule {}

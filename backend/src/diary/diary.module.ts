import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './domain/diary.entity';
import { DiaryRepository } from './domain/diary.repository';
import { DiaryService } from './application/diary.service';
import { UserService } from 'src/users/application/user.service';
import { UserRepository } from 'src/users/domain/user.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DiaryController],
  providers: [DiaryRepository, UserRepository, DiaryService, UserService],
})
export class DiaryModule {}

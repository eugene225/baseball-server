import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './domain/diary.domain';
import { DiaryRepository } from './domain/diary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  controllers: [DiaryController],
  providers: [DiaryRepository],
})
export class DiaryModule {}

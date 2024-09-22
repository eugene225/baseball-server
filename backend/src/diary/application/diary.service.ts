import { InjectRepository } from '@nestjs/typeorm';
import { DiaryRepository } from '../domain/diary.repository';
import { CreateDiaryRequestDto } from '../dto/create-diary-request.dto';
import { UserService } from 'src/users/application/user.service';
import { User } from 'src/users/domain/user.entity';
import { DiaryDto } from '../dto/diary.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Diary } from '../domain/diary.entity';
import { DiaryEntryService } from './diary-entry.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryEntryService: DiaryEntryService,
    private readonly userService: UserService,
  ) {}

  async create(
    requestDto: CreateDiaryRequestDto,
    user: User,
  ): Promise<DiaryDto> {
    const diary = await this.diaryRepository.createDiary(requestDto, user);

    return DiaryDto.create(diary);
  }

  async getAllPublicDiaries(): Promise<DiaryDto[]> {
    const publicDiaries = await this.diaryRepository.find({
      where: {
        isPublic: true,
      },
      relations: ['creator'],
    });

    return publicDiaries.map((diary) => DiaryDto.create(diary));
  }

  async getAllPrivateDiaries(user: User): Promise<DiaryDto[]> {
    const publicDiaries = await this.diaryRepository.find({
      where: {
        creator: user,
        isPublic: false,
      },
      relations: ['creator'],
    });

    return publicDiaries.map((diary) => DiaryDto.create(diary));
  }

  async deleteById(diaryId: number, user: User) {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ['creator'],
    });

    if (diary.creator.id !== user.id) {
      throw new UnauthorizedException(
        '본인이 만든 일기장만 삭제할 수 있습니다.',
      );
    }

    await this.diaryEntryService.deleteAllByDiaryId(diaryId);
    await this.diaryRepository.delete({ id: diary.id });
  }
}

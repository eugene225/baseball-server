import { InjectRepository } from '@nestjs/typeorm';
import { DiaryRepository } from '../domain/diary.repository';
import { CreateDiaryRequestDto } from '../dto/createDiary-request.dto';
import { UserService } from 'src/users/application/user.service';
import { User } from 'src/users/domain/user.entity';
import { DiaryDto } from '../dto/diary.dto';

export class DiaryService {
  constructor(
    @InjectRepository(DiaryRepository)
    private readonly diaryRepository: DiaryRepository,
    private readonly userService: UserService,
  ) {}

  async create(
    requestDto: CreateDiaryRequestDto,
    user: User,
  ): Promise<DiaryDto> {
    const diary = await this.diaryRepository.createDiary(requestDto, user);

    return DiaryDto.create(diary);
  }
}

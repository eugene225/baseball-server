import { DataSource, Repository } from 'typeorm';
import { Diary } from './diary.entity.js';
import { CreateDiaryRequestDto } from '../dto/create-diary-request.dto.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';
import { User } from '../../users/domain/user.entity.js';

@CustomRepository(Diary)
export class DiaryRepository extends Repository<Diary> {
  constructor(dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  async createDiary(
    createDiaryRequestDto: CreateDiaryRequestDto,
    user: User,
  ): Promise<Diary> {
    const { title, description, isPublic } = createDiaryRequestDto;
    const diary = this.create({ title, description, isPublic, creator: user });

    return await this.save(diary);
  }
}

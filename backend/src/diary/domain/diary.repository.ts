import { DataSource, Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { CreateDiaryRequestDto } from '../dto/create-diary-request.dto';
import { CustomRepository } from 'src/global/decorator/custom-repository.decorator';
import { User } from 'src/users/domain/user.entity';

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

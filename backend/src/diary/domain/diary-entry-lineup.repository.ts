import { DataSource, Repository } from 'typeorm';
import { DiaryEntryLineUp } from './diary-entry-lineup.entity';
import { CustomRepository } from 'src/global/decorator/custom-repository.decorator';

@CustomRepository(DiaryEntryLineUp)
export class DiaryEntryLineUpRepository extends Repository<DiaryEntryLineUp> {
  constructor(dataSource: DataSource) {
    super(DiaryEntryLineUp, dataSource.createEntityManager());
  }
}

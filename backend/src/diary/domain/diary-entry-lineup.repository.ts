import { DataSource, Repository } from 'typeorm';
import { DiaryEntryLineUp } from './diary-entry-lineup.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';

@CustomRepository(DiaryEntryLineUp)
export class DiaryEntryLineUpRepository extends Repository<DiaryEntryLineUp> {
  constructor(dataSource: DataSource) {
    super(DiaryEntryLineUp, dataSource.createEntityManager());
  }
}

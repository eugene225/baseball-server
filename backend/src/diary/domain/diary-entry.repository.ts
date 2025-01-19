import { DataSource, Repository } from 'typeorm';
import { DiaryEntry } from './diary-entry.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';

@CustomRepository(DiaryEntry)
export class DiaryEntryRepository extends Repository<DiaryEntry> {
  constructor(dataSource: DataSource) {
    super(DiaryEntry, dataSource.createEntityManager());
  }
}

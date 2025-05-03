import { DataSource, Repository } from 'typeorm';
import { FcmInfo } from './fcmInfo.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';

@CustomRepository(FcmInfo)
export class FcmInfoRepository extends Repository<FcmInfo> {
  constructor(dataSource: DataSource) {
    super(FcmInfo, dataSource.createEntityManager());
  }

  async findByUserId(userId: number): Promise<FcmInfo | null> {
    return this.findOneBy({ userId });
  }

  async updateByUserId(userId: number, fcmToken: string | null): Promise<FcmInfo> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      existing.fcmToken = fcmToken;
      return this.save(existing);
    }

    return this.save(this.create({ userId, fcmToken }));
  }
}
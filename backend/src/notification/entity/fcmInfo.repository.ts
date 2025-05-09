import { DataSource, Repository } from 'typeorm';
import { FcmInfo } from './fcmInfo.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';
import { User } from '../../users/domain/user.entity.js';

@CustomRepository(FcmInfo)
export class FcmInfoRepository extends Repository<FcmInfo> {
  constructor(dataSource: DataSource) {
    super(FcmInfo, dataSource.createEntityManager());
  }

  async findByUserId(userId: number): Promise<FcmInfo | null> {
    return this.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findAllFcmTokenIsNotNull(): Promise<FcmInfo[]> {
    return this.createQueryBuilder('fcmInfo')
      .leftJoinAndSelect('fcmInfo.user', 'user')
      .where('fcmInfo.fcmToken IS NOT NULL')
      .getMany();
  }

  async updateByUserId(userId: number, fcmToken: string | null): Promise<FcmInfo> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      existing.fcmToken = fcmToken;
      return this.save(existing);
    }

    const user = new User();
    user.id = userId;

    return this.save(this.create({ user, fcmToken }));
  }
}
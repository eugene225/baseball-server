import { DataSource, Repository } from 'typeorm';
import { FcmInfo } from './fcmInfo.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';
import { User } from '../../users/domain/user.entity.js';

@CustomRepository(FcmInfo)
export class FcmInfoRepository extends Repository<FcmInfo> {
  constructor(dataSource: DataSource) {
    super(FcmInfo, dataSource.createEntityManager());
  }

  async findByUserIdAndDeviceType(userId: number, deviceType: string): Promise<FcmInfo | null> {
    return this.findOne({
      where: { user: { id: userId }, deviceType },
      relations: ['user'],
    });
  }

  async findAllFcmTokenIsNotNull(): Promise<FcmInfo[]> {
    return this.createQueryBuilder('fcmInfo')
      .leftJoinAndSelect('fcmInfo.user', 'user')
      .where('fcmInfo.fcmToken IS NOT NULL')
      .getMany();
  }

  async updateByUserIdAndDeviceType(userId: number, fcmToken: string, deviceType: string): Promise<FcmInfo> {
    const existing = await this.findOne({
      where: { user: { id: userId } , deviceType},
      relations: ['user'],
    });

    if (existing) {
      existing.fcmToken = fcmToken;
      existing.deviceType = deviceType || existing.deviceType;
      return this.save(existing);
    }

    const user = new User();
    user.id = userId;

    const newFcmInfo = this.create({ 
      user, 
      fcmToken, 
      deviceType: deviceType || 'mobile'
    });
    
    const savedFcmInfo = await this.save(newFcmInfo);
    return this.findOne({
      where: { id: savedFcmInfo.id },
      relations: ['user'],
    });
  }

  async deleteByUserIdAndDeviceType(userId: number, deviceType: string): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(FcmInfo)
      .where('user.id = :userId AND deviceType = :deviceType', { userId, deviceType })
      .execute();
  }

  async deleteTokens(tokens: string[]) {
    await this.createQueryBuilder()
      .delete()
      .from(FcmInfo)
      .where('fcmToken IN (:...tokens)', { tokens })
      .execute();
  }
}
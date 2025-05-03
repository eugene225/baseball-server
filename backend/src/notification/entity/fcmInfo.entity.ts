import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fcm_info')
export class FcmInfo extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'fcm_token', nullable: true })
  fcmToken: string;

  constructor(userId: number, fcmToken: string) {
    super();
    this.userId = userId;
    this.fcmToken = fcmToken;
  }
}
import { User } from '../../users/domain/user.entity.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fcm_info')
export class FcmInfo extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fcm_token', nullable: true })
  fcmToken: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'device_type', nullable: false })
  deviceType: string; // mobile, desktop, tablet
}
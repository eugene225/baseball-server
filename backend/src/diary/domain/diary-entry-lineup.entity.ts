import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntry } from './diary-entry.entity.js';
import { Player } from '../../player/domain/player.entity.js';
import { forwardRef } from '@nestjs/common';

@Entity()
export class DiaryEntryLineUp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'orderNum' })
  orderNum: number;

  @ManyToOne(() => DiaryEntry)
  diaryEntry: DiaryEntry;

  @ManyToOne(() => Player)
  player: Player;
}

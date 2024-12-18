import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntry } from './diary-entry.entity';
import { Player } from 'src/player/domain/player.entity';

@Entity()
export class DiaryEntryLineUp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => DiaryEntry, (diaryEntry) => diaryEntry.lineUp)
  diaryEntry: DiaryEntry;

  @ManyToOne(() => Player)
  player: Player;
}

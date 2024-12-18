import { Team } from 'src/global/enum/team.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Weather } from './weather.enum';
import { Diary } from './diary.entity';
import { User } from 'src/users/domain/user.entity';
import { DiaryEntryLineUp } from './diary-entry-lineup.entity';

@Entity()
export class DiaryEntry extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  myTeam: Team;

  @Column()
  opponent: Team;

  @Column()
  awayTeamScore: number;

  @Column()
  homeTeamScore: number;

  @Column({ type: 'enum', enum: Weather, nullable: false })
  weather: Weather;

  @OneToMany(() => DiaryEntryLineUp, (lineUp) => lineUp.diaryEntry, {
    cascade: true,
  })
  lineUp: DiaryEntryLineUp[];

  @ManyToOne(() => Diary)
  diary: Diary;

  @ManyToOne(() => User)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

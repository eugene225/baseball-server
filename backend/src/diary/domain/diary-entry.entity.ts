import { Team } from '../../global/enum/team.enum.js';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Weather } from './weather.enum.js';
import { Diary } from './diary.entity.js';
import { User } from '../../users/domain/user.entity.js';

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

  @ManyToOne(() => Diary)
  diary: Diary;

  @ManyToOne(() => User)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

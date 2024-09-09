import { Team } from 'src/global/enum/team.enum';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Weather } from './weather.enum';
import { Diary } from './diary.entity';
import { User } from 'src/users/domain/user.entity';

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

    @Column()
    weather: Weather;

    @Column()
    lineUp: string[];

    @ManyToOne(() => Diary)
    diary: Diary;

    @ManyToOne(() => User)
    author: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import { Team } from 'src/global/enum/team.enum';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Weather } from './weather.enum';
import { Diary } from './diary.entity';
import { User } from 'src/users/domain/user.entity';
import { Player } from 'src/player/domain/player.entity';

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

    @ManyToMany(() => Player, {cascade: true})
    @JoinTable({name: 'line_up'})
    lineUp: Player[];

    @ManyToOne(() => Diary)
    diary: Diary;

    @ManyToOne(() => User)
    author: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
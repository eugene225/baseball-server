import { Team } from 'src/teams/team.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Team, nullable: true })
  myTeam: Team;

  updateInfo(nickname: string, myTeam: Team) {
    this.nickname = nickname;
    this.myTeam = myTeam;
  }
}

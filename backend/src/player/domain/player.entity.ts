import { Position } from 'src/global/enum/position.enum';
import { Team } from 'src/global/enum/team.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Position, nullable: false })
  position: Position;

  @Column({ type: 'enum', enum: Team, nullable: false })
  team: Team;
}

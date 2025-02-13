import { Position } from '../../global/enum/position.enum.js';
import { Team } from '../../global/enum/team.enum.js';
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

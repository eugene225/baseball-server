import { Position } from 'src/global/enum/position.enum';
import { Team } from 'src/global/enum/team.enum';
import { Player } from '../domain/player.entity';

export class PlayerDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly position: Position,
    public readonly team: Team,
  ) {}

  static fromPlayer(player: Player): PlayerDto {
    return new PlayerDto(player.id, player.name, player.position, player.team);
  }
}

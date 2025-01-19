import { Position } from '../../global/enum/position.enum.js';
import { Team } from '../../global/enum/team.enum.js';
import { Player } from '../domain/player.entity.js';

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

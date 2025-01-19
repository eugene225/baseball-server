import { Team } from '../../global/enum/team.enum.js';
import { Position } from '../../global/enum/position.enum.js';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from '../domain/player.repository.js';
import { Injectable } from '@nestjs/common';
import { PlayerDto } from '../dto/player.dto.js';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async getAllPlayersBy(team: Team, position: Position) {
    const players = await this.playerRepository.find({
      where: { team, position },
    });

    const playerDtos = players.map((player) => PlayerDto.fromPlayer(player));
    return playerDtos;
  }
}

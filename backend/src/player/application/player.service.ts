import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from '../domain/player.repository';
import { Injectable } from '@nestjs/common';
import { Team } from 'src/global/enum/team.enum';
import { PlayerDto } from '../dto/player.dto';
import { Position } from 'src/global/enum/position.enum';

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

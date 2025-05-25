import { Team } from '../../global/enum/team.enum.js';
import { Position } from '../../global/enum/position.enum.js';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { PlayerRepository } from '../domain/player.repository.js';
import { Injectable } from '@nestjs/common';
import { PlayerDto } from '../dto/player.dto.js';
import { ReadOnlyTransactional } from '../../global/decorator/custom-transaction.decorator.js';
import { DataSource } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @ReadOnlyTransactional()
  async getAllPlayersBy(team: Team, position: Position) {
    const players = await this.playerRepository.find({
      where: { team, position },
    });

    const playerDtos = players.map((player) => PlayerDto.fromPlayer(player));
    return playerDtos;
  }
}

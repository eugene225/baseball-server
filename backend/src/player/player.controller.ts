import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayerService } from './application/player.service.js';
import { Team } from '../global/enum/team.enum.js';
import { Position } from '../global/enum/position.enum.js';

@Controller('/api/v1/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/:team')
  async getAllPlayersByTeam(
    @Param('team') team: Team,
    @Query('position') position: Position,
  ) {
    return this.playerService.getAllPlayersBy(team, position);
  }
}

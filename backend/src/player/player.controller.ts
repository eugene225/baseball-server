import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayerService } from './application/player.service';
import { Team } from 'src/global/enum/team.enum';
import { Position } from 'src/global/enum/position.enum';

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

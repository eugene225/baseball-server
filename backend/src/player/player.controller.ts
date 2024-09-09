import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './application/player.service';
import { Team } from 'src/global/enum/team.enum';

@Controller('/api/v1/players')
export class PlayerController {
    constructor(
        private readonly playerService: PlayerService
    ){}

    @Get()
    async getAllPlayersByTeam(
        @Param('team') team: Team
    ){
        return this.playerService.getAllPlayersBy(team);
    }
}

import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "../domain/player.entity";
import { PlayerRepository } from "../domain/player.repository";
import { Injectable } from "@nestjs/common";
import { Team } from "src/global/enum/team.enum";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: PlayerRepository
    ){}

    async getAllPlayersBy(team: Team) {
        const players = await this.playerRepository.find({
            where: { team },
        })

        const playerDtos = players.map(player => PlayerDto.fromPlayer(player));
        return playerDtos;
    }
}
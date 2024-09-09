import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "../domain/player.entity";
import { PlayerRepository } from "../domain/player.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: PlayerRepository
    ){}
}
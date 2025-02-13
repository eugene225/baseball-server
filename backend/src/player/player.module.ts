import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './domain/player.entity.js';
import { PlayerService } from './application/player.service.js';
import { PlayerRepository } from './domain/player.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
})
export class PlayerModule {}

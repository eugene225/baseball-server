import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './domain/player.entity';
import { PlayerService } from './application/player.service';
import { PlayerRepository } from './domain/player.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
})
export class PlayerModule {}

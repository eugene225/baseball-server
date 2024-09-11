import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './domain/player.entity';
import { PlayerService } from './application/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}

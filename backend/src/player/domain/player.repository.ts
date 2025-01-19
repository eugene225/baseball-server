import { DataSource, Repository } from 'typeorm';
import { Player } from './player.entity.js';
import { CustomRepository } from '../../global/decorator/custom-repository.decorator.js';

@CustomRepository(Player)
export class PlayerRepository extends Repository<Player> {
  constructor(dataSource: DataSource) {
    super(Player, dataSource.createEntityManager());
  }
}

import { DataSource, Repository } from 'typeorm';
import { Player } from './player.entity';
import { CustomRepository } from 'src/global/decorator/custom-repository.decorator';

@CustomRepository(Player)
export class PlayerRepository extends Repository<Player> {
  constructor(dataSource: DataSource) {
    super(Player, dataSource.createEntityManager());
  }
}

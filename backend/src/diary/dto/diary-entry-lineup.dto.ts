import { DiaryEntryLineUp } from './../domain/diary-entry-lineup.entity.js';
import { Position } from '../../global/enum/position.enum.js';

export class DiaryEntryLineUpDto {
  constructor(
    public readonly orderNum: number,
    public readonly playerId: number,
    public readonly playerName: string,
    public readonly playerPosition: Position,
  ) {}

  static create(diaryEntryLineUp: DiaryEntryLineUp): DiaryEntryLineUpDto {
    return new DiaryEntryLineUpDto(
      diaryEntryLineUp.orderNum,
      diaryEntryLineUp.player.id,
      diaryEntryLineUp.player.name,
      diaryEntryLineUp.player.position,
    );
  }
}

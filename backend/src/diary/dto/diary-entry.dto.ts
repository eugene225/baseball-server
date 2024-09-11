import { Team } from 'src/global/enum/team.enum';
import { PlayerDto } from 'src/player/dto/player.dto';
import { DiaryEntry } from '../domain/diary-entry.entity';
import { Weather } from '../domain/weather.enum';

export class DiaryEntryDto {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly content: string,
    public readonly myTeam: Team,
    public readonly opponent: Team,
    public readonly awayTeamScore: number,
    public readonly homeTeamScore: number,
    public readonly weather: Weather,
    public readonly lineUp: PlayerDto[],
    public readonly diaryId: number,
    public readonly authorNickname: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(
    diaryId: number,
    diaryEntry: DiaryEntry,
    lineUp: PlayerDto[],
  ): DiaryEntryDto {
    return new DiaryEntryDto(
      diaryEntry.id,
      diaryEntry.title,
      diaryEntry.content,
      diaryEntry.myTeam,
      diaryEntry.opponent,
      diaryEntry.awayTeamScore,
      diaryEntry.homeTeamScore,
      diaryEntry.weather,
      lineUp,
      diaryId,
      diaryEntry.author.nickname,
      diaryEntry.createdAt,
      diaryEntry.updatedAt,
    );
  }
}

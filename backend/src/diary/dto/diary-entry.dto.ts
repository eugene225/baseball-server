import { Team } from 'src/global/enum/team.enum';
import { DiaryEntry } from '../domain/diary-entry.entity';
import { Weather } from '../domain/weather.enum';
import { DiaryEntryLineUp } from '../domain/diary-entry-lineup.entity';
import { DiaryEntryLineUpDto } from './diary-entry-lineup.dto';

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
    public readonly lineUp: DiaryEntryLineUpDto[],
    public readonly diaryId: number,
    public readonly authorNickname: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(
    diaryId: number,
    diaryEntry: DiaryEntry,
    lineUp: DiaryEntryLineUp[],
  ): DiaryEntryDto {
    const diaryEntryLineUpDto = lineUp
      .map((entryLineUp) => DiaryEntryLineUpDto.create(entryLineUp))
      .sort((a, b) => a.orderNum - b.orderNum);
    return new DiaryEntryDto(
      diaryEntry.id,
      diaryEntry.title,
      diaryEntry.content,
      diaryEntry.myTeam,
      diaryEntry.opponent,
      diaryEntry.awayTeamScore,
      diaryEntry.homeTeamScore,
      diaryEntry.weather,
      diaryEntryLineUpDto,
      diaryId,
      diaryEntry.author.nickname,
      diaryEntry.createdAt,
      diaryEntry.updatedAt,
    );
  }
}

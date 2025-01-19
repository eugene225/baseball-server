import { Team } from '../../global/enum/team.enum.js';
import { Weather } from '../domain/weather.enum.js';

export class CreateDiaryEntryRequestDto {
  title: string;
  content: string;
  myTeam: Team;
  opponent: Team;
  awayTeamScore: number;
  homeTeamScore: number;
  weather: Weather;
  lineUp: { orderNum: number; playerId: number }[];
}

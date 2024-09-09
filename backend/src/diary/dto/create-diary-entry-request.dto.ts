import { Team } from "src/global/enum/team.enum";
import { Weather } from "../domain/weather.enum";

export class CreateDiaryEntryRequestDto {
    title: string;
    content: string;
    myTeam: Team;
    opponent: Team;
    awayTeamScore: number;
    homeTeamScore: number;
    weather: Weather;
    lineUp: number[];
}
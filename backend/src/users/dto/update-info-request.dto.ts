import { IsEnum, MinLength } from 'class-validator';
import { Team } from '../../global/enum/team.enum.js';

export class UpdateUserInfoRequest {
  @MinLength(2)
  nickname: string;

  @IsEnum(Team)
  myTeam: Team;
}

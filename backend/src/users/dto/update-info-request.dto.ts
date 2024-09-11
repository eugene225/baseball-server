import { IsEnum, MinLength } from 'class-validator';
import { Team } from 'src/global/enum/team.enum';

export class UpdateUserInfoRequest {
  @MinLength(2)
  nickname: string;

  @IsEnum(Team)
  myTeam: Team;
}

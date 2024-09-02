import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Team } from 'src/teams/team.enum';

export class UpdateUserInfoRequest {
  @IsNotEmpty()
  @MinLength(2)
  nickname: string;
  @IsNotEmpty()
  @IsEnum(Team)
  myTema: Team;
}

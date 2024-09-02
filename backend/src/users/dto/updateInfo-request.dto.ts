import { IsNotEmpty, Min } from 'class-validator';
import { Team } from 'src/teams/team.enum';

export class UpdateUserInfoRequest {
  @IsNotEmpty()
  @Min(2)
  nickname: string;
  myTema: Team;
}

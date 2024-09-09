import { DiaryRepository } from './../domain/diary.repository';
import { InjectRepository } from "@nestjs/typeorm";
import { DiaryEntry } from "../domain/diary-entry.entity";
import { DiaryEntryRepository } from "../domain/diary-entry.repository";
import { Injectable } from "@nestjs/common";
import { CreateDiaryEntryRequestDto } from "../dto/create-diary-entry-request.dto";
import { User } from "src/users/domain/user.entity";
import { Diary } from "../domain/diary.entity";
import { PlayerRepository } from 'src/player/domain/player.repository';
import { Player } from 'src/player/domain/player.entity';
import { DiaryEntryDto } from '../dto/diary-entry.dto';

@Injectable()
export class DiaryEntryService {
    constructor(
        @InjectRepository(DiaryEntry)
        private readonly diaryEntryRepository: DiaryEntryRepository,
        @InjectRepository(Diary)
        private readonly diaryRepository: DiaryRepository,
        @InjectRepository(Player)
        private readonly playerRepository: PlayerRepository,
    ){}

    async create(createDiaryEntryRequestDto: CreateDiaryEntryRequestDto, author: User, diaryId: number): Promise<DiaryEntry> {
        const { title, content, myTeam, opponent, awayTeamScore, homeTeamScore, weather, lineUp } = createDiaryEntryRequestDto;
    
        const diary = await this.diaryRepository.findOneBy({ id: diaryId });
        if (!diary) {
            throw new Error(`DiaryNotFound id ${diaryId}`);
        }
    
        const players = await Promise.all(
            lineUp.map(async (playerId) => {
                const player = await this.playerRepository.findOneBy({ id: playerId });
                if (!player) {
                    throw new Error(`PlayerNotFound id ${playerId}`);
                }
                return player;
            })
        );
    
        const diaryEntry = this.diaryEntryRepository.create({ title, content, myTeam, opponent, awayTeamScore, homeTeamScore, weather, lineUp: players, author, diary });
    
        return this.diaryEntryRepository.save(diaryEntry);
    }

    async getAllEntriesBy(diaryId: number, user: User): Promise<DiaryEntryDto[]> {
        const diary = await this.diaryRepository.findOneBy({id: diaryId});
        if(!diary.isPublic && diary.creator.id !== user.id) {
            throw new Error('This Diary is Private !');
        }

        const entries = await this.diaryEntryRepository.find({
            where: { diary: { id: diaryId } },
            relations: ['lineUp', 'author']
        });

        const entriesDto = entries.map(entry => {
            return {
                id: entry.id,
                title: entry.title,
                content: entry.content,
                myTeam: entry.myTeam,
                opponent: entry.opponent,
                awayTeamScore: entry.awayTeamScore,
                homeTeamScore: entry.homeTeamScore,
                weather: entry.weather,
                lineUp: entry.lineUp.map(player => ({
                    id: player.id,
                    name: player.name,
                    position: player.position,
                    team: player.team
                })),
                diaryId: entry.diary.id,
                authorNickname: entry.author.nickname,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            } as DiaryEntryDto;
        });

        return entriesDto
    }
    
}
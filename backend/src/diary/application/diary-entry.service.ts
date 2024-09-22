/* eslint-disable prettier/prettier */
import { DiaryRepository } from './../domain/diary.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntry } from '../domain/diary-entry.entity';
import { DiaryEntryRepository } from '../domain/diary-entry.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryEntryRequestDto } from '../dto/create-diary-entry-request.dto';
import { User } from 'src/users/domain/user.entity';
import { Diary } from '../domain/diary.entity';
import { PlayerRepository } from 'src/player/domain/player.repository';
import { Player } from 'src/player/domain/player.entity';
import { DiaryEntryDto } from '../dto/diary-entry.dto';
import { PlayerDto } from 'src/player/dto/player.dto';

@Injectable()
export class DiaryEntryService {
  constructor(
    @InjectRepository(DiaryEntry)
    private readonly diaryEntryRepository: DiaryEntryRepository,
    @InjectRepository(Diary)
    private readonly diaryRepository: DiaryRepository,
    @InjectRepository(Player)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async create(
    createDiaryEntryRequestDto: CreateDiaryEntryRequestDto,
    author: User,
    diaryId: number,
  ): Promise<DiaryEntry> {
    const {
      title,
      content,
      myTeam,
      opponent,
      awayTeamScore,
      homeTeamScore,
      weather,
      lineUp,
    } = createDiaryEntryRequestDto;

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
      }),
    );

    const diaryEntry = this.diaryEntryRepository.create({
      title,
      content,
      myTeam,
      opponent,
      awayTeamScore,
      homeTeamScore,
      weather,
      lineUp: players,
      author,
      diary,
    });

    return this.diaryEntryRepository.save(diaryEntry);
  }

  async getAllEntriesBy(diaryId: number, user: User): Promise<DiaryEntryDto[]> {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ['creator'],
    });
    if (!diary.isPublic && diary.creator.id !== user.id) {
      throw new Error('This Diary is Private !');
    }

    const entries = await this.diaryEntryRepository.find({
      where: { diary: { id: diary.id } },
      relations: ['author', 'lineUp'],
    });

    const entriesDto = entries.map((entry) =>
      DiaryEntryDto.create(
        diaryId,
        entry,
        entry.lineUp.map((player) => PlayerDto.fromPlayer(player)),
      ),
    );

    return entriesDto;
  }

  async deleteAllByDiaryId(diaryId: number) {
    const result = await this.diaryEntryRepository
      .createQueryBuilder()
      .delete()
      .from(DiaryEntry)
      .where("diaryId = :diaryId", { diaryId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`No diary entries found for diaryId ${diaryId}`);
    }
  }
}

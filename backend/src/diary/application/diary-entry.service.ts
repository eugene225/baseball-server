import { DiaryRepository } from './../domain/diary.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntry } from '../domain/diary-entry.entity';
import { DiaryEntryRepository } from '../domain/diary-entry.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryEntryRequestDto } from '../dto/create-diary-entry-request.dto';
import { User } from 'src/users/domain/user.entity';
import { PlayerRepository } from 'src/player/domain/player.repository';
import { DiaryEntryDto } from '../dto/diary-entry.dto';
import { DiaryEntryLineUp } from '../domain/diary-entry-lineup.entity';
import { DiaryEntryLineUpRepository } from '../domain/diary-entry-lineup.repository';

@Injectable()
export class DiaryEntryService {
  constructor(
    @InjectRepository(DiaryEntryRepository)
    private readonly diaryEntryRepository: DiaryEntryRepository,
    @InjectRepository(DiaryRepository)
    private readonly diaryRepository: DiaryRepository,
    @InjectRepository(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
    @InjectRepository(DiaryEntryLineUpRepository)
    private readonly diaryEntryLineUpRepository,
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

    // 선수 정보 조회
    const players = await Promise.all(
      lineUp.map(async ({ order, playerId }) => {
        const player = await this.playerRepository.findOneBy({ id: playerId });
        if (!player) {
          throw new Error(`PlayerNotFound id ${playerId}`);
        }
        return { order, player };
      }),
    );

    console.log(players);

    // DiaryEntryLineUp 생성
    const diaryEntryLineUps = players.map(({ order, player }) => {
      const diaryEntryLineUp = new DiaryEntryLineUp();
      diaryEntryLineUp.order = order;
      diaryEntryLineUp.player = player;
      return diaryEntryLineUp;
    });
    await this.diaryEntryLineUpRepository.save(diaryEntryLineUps);

    const diaryEntry = this.diaryEntryRepository.create({
      title,
      content,
      myTeam,
      opponent,
      awayTeamScore,
      homeTeamScore,
      weather,
      author,
      diary,
      lineUp: diaryEntryLineUps,
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
      order: { createdAt: 'DESC' },
    });

    const entriesDto = entries.map((entry) =>
      DiaryEntryDto.create(
        diaryId,
        entry,
        entry.lineUp.sort((a, b) => a.order - b.order),
      ),
    );

    return entriesDto;
  }

  async deleteAllByDiaryId(diaryId: number) {
    const result = await this.diaryEntryRepository
      .createQueryBuilder()
      .delete()
      .from(DiaryEntry)
      .where('diaryId = :diaryId', { diaryId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        `No diary entries found for diaryId ${diaryId}`,
      );
    }
  }
}

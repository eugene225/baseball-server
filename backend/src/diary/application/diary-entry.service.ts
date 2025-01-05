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
import { In } from 'typeorm';

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
    private readonly diaryEntryLineUpRepository: DiaryEntryLineUpRepository,
  ) {}

  async create(
    createDiaryEntryRequestDto: CreateDiaryEntryRequestDto,
    author: User,
    diaryId: number,
  ): Promise<DiaryEntryDto> {
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

    // 다이어리 조회
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    if (!diary) {
      throw new Error(`DiaryNotFound id ${diaryId}`);
    }

    // 선수 정보 조회 (선수 정보를 한 번에 가져오기)
    const playerIds = lineUp.map(({ playerId }) => playerId);
    const players = await this.playerRepository.find({
      where: {
        id: In(playerIds),
      },
    });

    // 선수 정보가 없으면 에러 처리
    if (players.length !== playerIds.length) {
      const missingPlayerIds = playerIds.filter(
        (id) => !players.some((player) => player.id === id),
      );
      throw new Error(`Player(s) not found: ${missingPlayerIds.join(', ')}`);
    }

    // Player와 orderNum 결합
    const playersWithOrder = lineUp.map(({ orderNum, playerId }) => ({
      orderNum,
      player: players.find((player) => player.id === playerId),
    }));

    // DiaryEntry 생성 및 저장
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
    });
    const savedDiaryEntry = await this.diaryEntryRepository.save(diaryEntry);

    // DiaryEntryLineUp 생성
    const diaryEntryLineUps = playersWithOrder.map(({ orderNum, player }) => {
      const diaryEntryLineUp = new DiaryEntryLineUp();
      diaryEntryLineUp.orderNum = orderNum;
      diaryEntryLineUp.diaryEntry = savedDiaryEntry; // 순환 참조 방지
      diaryEntryLineUp.player = player;
      return diaryEntryLineUp;
    });

    // DiaryEntryLineUp 저장
    await this.diaryEntryLineUpRepository.save(diaryEntryLineUps);

    // DTO 생성 및 반환
    return DiaryEntryDto.create(diaryId, savedDiaryEntry, diaryEntryLineUps);
  }

  async getAllEntriesBy(diaryId: number, user: User): Promise<DiaryEntryDto[]> {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ['creator'],
    });
    if (!diary.isPublic && diary.creator.id !== user.id) {
      throw new Error('This Diary is Private !');
    }

    const entries = await this.diaryEntryRepository
      .createQueryBuilder('diaryEntry')
      .leftJoinAndSelect('diaryEntry.lineUp', 'lineUp')
      .leftJoinAndSelect('lineUp.player', 'player')
      .leftJoinAndSelect('diaryEntry.author', 'author')
      .where('diaryEntry.diaryId = :diaryId', { diaryId: diary.id })
      .orderBy('diaryEntry.createdAt', 'DESC')
      .getMany();

    const entriesDto = entries.map((entry) =>
      DiaryEntryDto.create(diaryId, entry, entry.lineUp),
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

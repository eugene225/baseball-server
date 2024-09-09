import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateDiaryRequestDto } from './dto/create-diary-request.dto';
import { DiaryService } from './application/diary.service';
import { AuthGuard } from '@nestjs/passport';
import { DiaryDto } from './dto/diary.dto';
import { DiaryEntryService } from './application/diary-entry.service';
import { DiaryEntryDto } from './dto/diary-entry.dto';
import { CreateDiaryEntryRequestDto } from './dto/create-diary-entry-request.dto';

@Controller('/api/v1/diary')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly diaryEntryService: DiaryEntryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createDiaryRequestDto: CreateDiaryRequestDto,
    @Request() req,
  ): Promise<DiaryDto> {
    const diary = this.diaryService.create(createDiaryRequestDto, req.user);

    return diary;
  }

  @Post('/:diaryId')
  @UseGuards(AuthGuard())
  async createEntry(
    @Param('diaryId') diaryId: number,
    @Body() createDiaryEntryRequestDto: CreateDiaryEntryRequestDto,
    @Request() req
  ) {
    const diaryEntry = this.diaryEntryService.create(createDiaryEntryRequestDto, req.user, diaryId);

    return diaryEntry;
  }

  @Get('/:diaryId')
  @UseGuards(AuthGuard())
  async getAllEntries(
    @Param('diaryId') diaryId: number,
    @Request() req,
  ): Promise<DiaryEntryDto[]>{
    const entries = this.diaryEntryService.getAllEntriesBy(diaryId, req.user);

    return entries;
  }

  @Get('/public')
  async getAllPublicDiaries(): Promise<DiaryDto[]> {
    const publicDiaries = await this.diaryService.getAllPublicDiaries();

    return publicDiaries;
  }

  @Get('/private')
  @UseGuards(AuthGuard())
  async getAllPrivateDiaries(@Request() req): Promise<DiaryDto[]> {
    const publicDiaries = await this.diaryService.getAllPrivateDiaries(req.user);

    return publicDiaries;
  }

  @Delete(':diaryId')
  @UseGuards(AuthGuard())
  async delete(@Param('diaryId') diaryId: number, @Request() req) {
    await this.diaryService.deleteById(diaryId, req.user);

    return {
      message: 'Diary successfully deleted',
      diaryId: diaryId,
    };
  }
}

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

@Controller('/api/v1/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createDiaryRequestDto: CreateDiaryRequestDto,
    @Request() req,
  ): Promise<DiaryDto> {
    const diary = this.diaryService.create(createDiaryRequestDto, req.user);

    return diary;
  }

  @Get('/public')
  async getAllPublicDiaries(): Promise<DiaryDto[]> {
    const publicDiaries = await this.diaryService.getAllPublicDiaries();

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

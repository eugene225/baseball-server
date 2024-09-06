import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateDiaryRequestDto } from './dto/createDiary-request.dto';
import { DiaryService } from './application/diary.service';
import { AuthGuard } from '@nestjs/passport';
import { DiaryDto } from './dto/diary.dto';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body() createDiaryRequestDto: CreateDiaryRequestDto,
    @Request() req,
  ): Promise<DiaryDto> {
    const diary = this.diaryService.create(createDiaryRequestDto, req.user);

    return diary;
  }
}

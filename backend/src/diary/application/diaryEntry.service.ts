import { InjectRepository } from "@nestjs/typeorm";
import { DiaryEntry } from "../domain/diaryEntry.entity";
import { DiaryEntryRepository } from "../domain/diaryEntry.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DiaryEntryService {
    constructor(
        @InjectRepository(DiaryEntry)
        private readonly diaryEntryRepository: DiaryEntryRepository,
    ){}
}
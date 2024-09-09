import { InjectRepository } from "@nestjs/typeorm";
import { DiaryEntry } from "../domain/diary-entry.entity";
import { DiaryEntryRepository } from "../domain/diary-entry.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DiaryEntryService {
    constructor(
        @InjectRepository(DiaryEntry)
        private readonly diaryEntryRepository: DiaryEntryRepository,
    ){}
}
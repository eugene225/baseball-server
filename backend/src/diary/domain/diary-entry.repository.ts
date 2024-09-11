import { CreateDiaryEntryRequestDto } from './../dto/create-diary-entry-request.dto';
import { DataSource, Repository } from "typeorm";
import { DiaryEntry } from "./diary-entry.entity";
import { CustomRepository } from "src/global/decorator/custom-repository.decorator";

@CustomRepository(DiaryEntry)
export class DiaryEntryRepository extends Repository<DiaryEntry> {
    constructor(dataSource: DataSource) {
        super(DiaryEntry, dataSource.createEntityManager());
    }
}
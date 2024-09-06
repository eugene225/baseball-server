import { Diary } from '../domain/diary.domain';

export class DiaryDto {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly isPublic: boolean,
    public readonly creator: string,
    public readonly createdAt: Date,
  ) {}

  static create(diary: Diary): DiaryDto {
    return new DiaryDto(
      diary.id,
      diary.title,
      diary.description,
      diary.isPublic,
      diary.creator.nickname,
      diary.createdAt,
    );
  }
}

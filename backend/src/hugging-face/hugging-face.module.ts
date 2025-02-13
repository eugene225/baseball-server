import { Module } from '@nestjs/common';
import { HuggingFaceController } from './hugging-face.controller';
import { HuggingFaceService } from './application/hugging-face/hugging-face.service';

@Module({
  controllers: [HuggingFaceController],
  providers: [HuggingFaceService]
})
export class HuggingFaceModule {}

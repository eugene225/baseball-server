import { Controller, Get, Query } from '@nestjs/common';
import { HuggingFaceService } from './application/hugging-face/hugging-face.service';

@Controller('/api/v1/hugging-face')
export class HuggingFaceController {
    constructor(private readonly huggingFaceService: HuggingFaceService) {}

  @Get('generate')
  async generateText(@Query('prompt') prompt: string): Promise<string> {
    return this.huggingFaceService.generateText(prompt);
  }
}

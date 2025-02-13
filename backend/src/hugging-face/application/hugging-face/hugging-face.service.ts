import { Injectable } from '@nestjs/common';

@Injectable()
export class HuggingFaceService {
  private static pipelineInstance: any;
  private static task: any;
  private static model = 'openai-community/gpt2';

  private static async loadPipeline() {
    if (!this.pipelineInstance) {
        const { pipeline } = await import('@xenova/transformers');
        this.task = 'text-generation';
      this.pipelineInstance = await pipeline(this.task, this.model);
    }
    return this.pipelineInstance;
  }

  public async generateText(prompt: string, maxLength: number = 50): Promise<string> {
    const generator = await HuggingFaceService.loadPipeline();
    const result = await generator(prompt, { max_length: maxLength });
    return result[0]?.generated_text || 'No text generated';
  }
}

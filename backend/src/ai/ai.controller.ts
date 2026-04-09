import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; history?: any[] }) {
    if (!body || !body.message) {
      return { response: "Xin lỗi, tôi không nghe rõ. Bạn có thể lặp lại được không?" };
    }
    const response = await this.aiService.chat(body.message, body.history || []);
    return { response };
  }
}

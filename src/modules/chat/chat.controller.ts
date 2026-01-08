import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { Response } from 'express';
import { ChatService } from '@/modules/chat/chat.service';
import { ChatDto } from '@/modules/chat/chat.dto';
@SkipAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async chat(@Body() dto: ChatDto) {
    return await this.chatService.chat(dto.message, dto.sessionId);
  }
}

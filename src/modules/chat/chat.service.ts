import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { config } from '@/config'; // Đảm bảo file config có biến CHAT_BOT_URL

// Import các Entity (Sửa đường dẫn import nếu project của bạn khác)
import { ChatMessage } from '@/modules/entity/chat-message.entity';
import { Conversation } from '@/modules/entity/conversation.entity';
import { RoleChatMessage } from '@/modules/ecommerce/dto/chat-message.dto'; // Enum: USER, ASSISTANT

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(ChatMessage)
    private chatMessageRepo: Repository<ChatMessage>,
  ) {}

  async chat(message: string, sessionId: string, userId?: string) {
    try {
      // 1. Quản lý hội thoại (Tìm hoặc tạo mới)
      const conversation = await this.findOrCreateConversation(
        sessionId,
        userId,
      );

      // 2. Lưu tin nhắn User
      await this.saveMessage(conversation.id, RoleChatMessage.USER, message);

      // 3. Gọi AI (Python)
      let botContent = '';
      let botSource = 'system';

      try {
        const response = await axios.post(
          config.CHAT_BOT_URL,
          { question: message, session_id: sessionId },
          { timeout: 20000 }, // Timeout 20s
        );

        // QUAN TRỌNG: Chỉ lấy đúng các trường dữ liệu cần thiết
        // Tuyệt đối không gán cả cục response.data vào
        if (response.data) {
          botContent = response.data.content || '';
          botSource = response.data.source || 'ai';
        }
      } catch (error) {
        this.logger.error(`AI Error: ${error.message}`);
        botContent = 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.';
        botSource = 'error';
      }

      // 4. Lưu tin nhắn Bot
      await this.saveMessage(conversation.id, RoleChatMessage.BOT, botContent);

      // 5. TRẢ VỀ DỮ LIỆU SẠCH (Clean DTO)
      // Tạo object mới hoàn toàn để tránh dính tham chiếu rác
      return {
        success: true,
        data: {
          sessionId: sessionId,
          message: message,
          reply: botContent, // Chỉ là string
          source: botSource, // Chỉ là string
        },
      };
    } catch (error) {
      this.logger.error('Chat System Error:', error);
      // Trả về lỗi HTTP chuẩn để Controller xử lý
      throw new HttpException(
        'Lỗi xử lý tin nhắn',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --- CÁC HÀM PHỤ TRỢ (PRIVATE) ---

  private async findOrCreateConversation(
    sessionId: string,
    userId?: string,
  ): Promise<Conversation> {
    // 1. Tìm trong DB
    let conversation = await this.conversationRepo.findOne({
      where: { sessionId },
    });

    // 2. Nếu chưa có thì tạo mới
    if (!conversation) {
      conversation = this.conversationRepo.create({
        sessionId,
        // Nếu User chưa login (userId undefined), ta gán null (yêu cầu cột userId trong DB phải cho phép NULL)
        ...(userId && { userId: userId }),
      });
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  private async saveMessage(
    conversationId: string,
    role: RoleChatMessage,
    content: string,
  ) {
    const msg = this.chatMessageRepo.create({ conversationId, role, content });
    return await this.chatMessageRepo.save(msg);
  }
}

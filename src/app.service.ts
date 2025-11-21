import { Injectable } from '@nestjs/common';
import { config } from '@/config';
import { LoggingService } from '@/base/logging/logging.service';
import { Logger } from 'log4js';
import { RedisService } from '@/base/database/redis/redis.service';
import { MailService } from '@/base/mail/mail.service';
import { MinioService } from '@/base/aws/aws.service';
import axios from 'axios';

@Injectable()
export class AppService {
  async chat(message: string, sessionId: string) {
    try {
      // Gọi sang service Python (tên container là python_chatbot, port 8000)
      const response = await axios.post(config.MINIO.HOST, {
        question: message,
        session_id: sessionId,
      });

      return response.data; // { source: '...', content: '...' }
    } catch (error) {
      console.error('Python Service Error:', error);
      return { content: 'Xin lỗi, bot đang bảo trì.' };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Policy } from '@/modules/entity/policy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OpenAIEmbeddings } from '@langchain/openai';
import { config } from '@/config';
import {
  CreatePolicyDto,
  UpdatePolicyDto,
} from '@/modules/ecommerce/dto/policy.dto';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { LoggingService } from '@/base/logging/logging.service';
import { TaskType } from '@google/generative-ai';
import { BaseListDto } from '@/base/service/base-list.dto';
import { Book } from '@/modules/entity';
import * as striptags from 'striptags';

@Injectable()
export class AdminPolicyService extends BaseService<Policy> {
  // private embeddingsModel: OpenAIEmbeddings;
  private embeddingsModel: GoogleGenerativeAIEmbeddings;
  private logger: LoggingService;
  constructor(
    @InjectRepository(Policy)
    protected readonly policyModel: Repository<Policy>,
    private loggingService: LoggingService,
  ) {
    super(policyModel);
    this.logger = loggingService.getCategory(AdminPolicyService.name);
    // Kiểm tra xem Key có load được không
    if (!config.GOOGLE_API_KEY) {
      this.logger.error('MISSING GOOGLE_API_KEY in Config!');
    }

    this.embeddingsModel = new GoogleGenerativeAIEmbeddings({
      modelName: 'text-embedding-004', // KHUYÊN DÙNG: Model mới, ổn định hơn
      apiKey: config.GOOGLE_API_KEY,
      taskType: TaskType.RETRIEVAL_DOCUMENT, // BẮT BUỘC: Định nghĩa kiểu task là lưu document
    });
  }

  async createPolicy(createPolicyDto: CreatePolicyDto) {
    const cleanContent = striptags(createPolicyDto.content);
    const vector = await this.generateEmbedding(cleanContent);
    console.log(cleanContent);
    // 2. Tạo entity kèm vector
    const newPolicy = this.policyModel.create({
      ...createPolicyDto,
      embedding: vector,
    });
    return this.policyModel.save(newPolicy);
  }

  async updatePolicy(id: string, updatePolicyDto: UpdatePolicyDto) {
    const policy = await this.getOne({ id });

    // Nếu có sửa nội dung thì phải tạo lại vector mới
    if (updatePolicyDto.content && updatePolicyDto.content !== policy.content) {
      const cleanContent = striptags(updatePolicyDto.content);
      const vector = await this.generateEmbedding(cleanContent);
      policy.embedding = vector;
    }

    Object.assign(policy, updatePolicyDto);
    return this.policyModel.save(policy);
  }

  // Helper function để gọi OpenAI
  private async generateEmbedding(text: string): Promise<number[]> {
    this.logger.log(`Start embedding text: ${text.substring(0, 20)}...`);
    try {
      // Thêm timeout để không bị treo vĩnh viễn
      const vector = await Promise.race([
        this.embeddingsModel.embedQuery(text),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout Google API')), 10000),
        ),
      ]);
      this.logger.log('Embedding success!');
      return vector;
    } catch (error) {
      this.logger.error('Embedding Failed:', error);
      throw error;
    }
  }
}

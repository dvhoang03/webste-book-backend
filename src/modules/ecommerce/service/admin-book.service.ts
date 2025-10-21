import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Book } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AdminBookService extends BaseService<Book> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {
    super(bookRepository);
  }

  async listByIds(ids: string[]) {
    return await this.bookRepository.find({ where: { id: In(ids) } });
  }
}

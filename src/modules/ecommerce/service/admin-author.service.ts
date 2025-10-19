import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '@/modules/entity';
import { BaseService } from '@/base/service/base-service.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminAuthorService extends BaseService<Author> {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {
    super(authorRepository);
  }
}

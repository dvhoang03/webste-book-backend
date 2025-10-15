import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '@/modules/entity';

@Injectable()
export class AdminAuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly adminAuthorService: AdminAuthorService,
  ) {}
}

import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Book } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';

@Injectable()
export class UserBookService extends AdminBookService {}

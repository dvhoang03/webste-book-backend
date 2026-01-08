import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Book, BookAuthor, BookCategory } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateBookDto, UpdateBookDto } from '@/modules/ecommerce/dto/book.dto';
import { BaseListDto } from '@/base/service/base-list.dto';

@Injectable()
export class AdminBookService extends BaseService<Book> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepository: Repository<BookCategory>,
    @InjectRepository(BookAuthor)
    private readonly bookAuthorRepository: Repository<BookAuthor>,
    private readonly dataSource: DataSource,
  ) {
    super(bookRepository);
  }

  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<Book>,
    dto: D,
  ): SelectQueryBuilder<Book> {
    const alias = qb.alias; // 't'

    // 1. Join và Select các bảng trung gian (BookAuthor, BookCategory)
    //    VÀ các bảng chính (Author, Category, Publisher)
    //    chỉ bằng một dòng cho mỗi quan hệ.
    qb.leftJoinAndSelect(`${alias}.publisher`, 'publisher');

    qb.leftJoinAndSelect(`${alias}.bookAuthors`, 'bookAuthor');
    qb.leftJoinAndSelect(`${alias}.bookCategories`, 'bookCategory');

    // 2. Join lồng cấp (nested join)
    //    Từ 'bookAuthor' (đã join ở trên), join tiếp vào 'author'
    qb.leftJoinAndSelect(`bookAuthor.author`, 'author');

    //    Từ 'bookCategory' (đã join ở trên), join tiếp vào 'category'
    qb.leftJoinAndSelect(`bookCategory.category`, 'category');

    return qb;
  }

  async listByIds(ids: string[]) {
    return await this.bookRepository.find({ where: { id: In(ids) } });
  }

  async createBook(dto: CreateBookDto) {
    // 4. Tạo một QueryRunner từ DataSource
    const queryRunner = this.dataSource.createQueryRunner();

    // 5. Kết nối queryRunner với SQL
    await queryRunner.connect();
    // 6. Bắt đầu một transaction
    await queryRunner.startTransaction();

    try {
      const { categoryIds = [], authorIds = [], ...bookData } = dto;

      const book = await queryRunner.manager.save(
        this.bookRepository.create(bookData),
      );
      const bookId = book.id;

      // 8. Tạo BookCategory bằng 'queryRunner.manager'
      if (categoryIds.length > 0) {
        const categories = categoryIds.map((categoryId) =>
          this.bookCategoryRepository.create({ categoryId, bookId }),
        );
        await queryRunner.manager.save(categories);
      }

      // 9. Tạo BookAuthor bằng 'queryRunner.manager'
      if (authorIds.length > 0) {
        const authors = authorIds.map((authorId) =>
          this.bookAuthorRepository.create({ authorId, bookId }),
        );
        await queryRunner.manager.save(authors);
      }

      // Commit transaction (luu vinh vien) neu moi thu thanh cong.
      await queryRunner.commitTransaction();
      return book;
    } catch (error) {
      // Rollback (huy bo) transaction neu co bat ki loi nao
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // CUC KI QUAN TRONG: giai phong QueryRunner
      // Du thanh cong hay that bao, luon phai release()
      // de trar ket nois ve "pool", tranh bij ro ri ket noi.
      await queryRunner.release();
    }
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    // 1. tao 1 queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    //2. Ket noi queryRunner voi SQL
    await queryRunner.connect();
    // 3. Start 1 transaction
    await queryRunner.startTransaction();

    try {
      const { categoryIds = [], authorIds = [], ...bookData } = updateBookDto;
      const book = await queryRunner.manager.findOne(
        this.bookRepository.target,
        { where: { id } },
      );
      if (!book) throw new BadRequestException('Book not found');
      // Capj nhat du lieu book
      queryRunner.manager.merge(this.bookRepository.target, book, bookData);
      await queryRunner.manager.save(book);

      // 3. xoa lien ket cu
      await queryRunner.manager.delete(this.bookCategoryRepository.target, {
        bookId: id,
      });
      await queryRunner.manager.delete(this.bookAuthorRepository.target, {
        bookId: id,
      });

      // 8. Tạo BookCategory bằng 'queryRunner.manager'
      if (categoryIds.length > 0) {
        const categories = categoryIds.map((categoryId) =>
          this.bookCategoryRepository.create({ categoryId, bookId: id }),
        );
        await queryRunner.manager.save(categories);
      }

      // 9. Tạo BookAuthor bằng 'queryRunner.manager'
      if (authorIds.length > 0) {
        const authors = authorIds.map((authorId) =>
          this.bookAuthorRepository.create({ authorId, bookId: id }),
        );
        await queryRunner.manager.save(authors);
      }
      // Commit transaction (luu vinh vien) neu moi thu thanh cong.
      await queryRunner.commitTransaction();
      return book;
    } catch (error) {
      // Rollback huy transaction neu co bat ki loi nao
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // CUC KI QUAN TRONG: giai phong QueryRunner
      // Du thanh cong hay that bao, luon phai release()
      // de tra ket nois ve "pool", tranh bij ro ri ket noi.
      await queryRunner.release();
    }
  }
}

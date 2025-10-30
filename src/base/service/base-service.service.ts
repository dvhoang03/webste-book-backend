// src/common/services/base.service.ts
import {
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  FindOptionsRelations,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    sort?: string;
  };
}

export class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  // --- helpers (đặt trong class hoặc tách ra file riêng cũng được)
  private col = (alias: string, f: string) => `${alias}.${f}`;

  private colAny = (alias: string, f: string) => {
    // Nếu field đã chứa dấu chấm (ví dụ: 'shipping.id')
    if (f.includes('.')) {
      return f; // Cứ trả về 'shipping.id', TypeORM sẽ tự xử lý
    }
    // Nếu là field của bảng chính (ví dụ: 'createdAt')
    return this.col(alias, f); // Sẽ gọi hàm col mới và trả về 'order.createdAt'
  };

  private safeParse = (v: any) => {
    if (typeof v !== 'string') return v ?? {};
    try {
      return JSON.parse(v);
    } catch {
      return {};
    }
  };

  private normalizeVal = (raw: any) => {
    if (typeof raw === 'string') {
      const s = raw.trim().toLowerCase();
      if (s === 'true') return true;
      if (s === 'false') return false;
      if (s !== '' && !isNaN(Number(s))) return Number(s);
    }
    return raw;
  };

  // --- CRUD operations (PHẦN MỚI THÊM)

  /**
   * Lấy một thực thể theo điều kiện.
   * Tự động throw NotFoundException nếu không tìm thấy.
   * @param where Điều kiện tìm kiếm (ví dụ: { id: 1 })
   * @param relations (MỚI) Danh sách relations cần load
   * @returns Promise<T>
   */
  async getOne(
    where: FindOptionsWhere<T>,
    relations: FindOptionsRelations<T> | string[] = [],
  ): Promise<T> {
    const entity = await this.repo.findOne({ where, relations });
    if (!entity) {
      // Tên entity để thông báo lỗi rõ ràng hơn
      const entityName = this.repo.metadata.name;
      throw new NotFoundException(`${entityName} not found.`);
    }
    return entity;
  }

  /**
   * Tạo một thực thể mới.
   * DTO đầu vào chứa các thuộc tính tương ứng với Entity.
   * @param dto Dữ liệu để tạo thực thể
   * @returns Promise<T> Thực thể đã được tạo
   */
  async create(dto: QueryDeepPartialEntity<T>): Promise<T> {
    // this.repo.create(dto) chỉ tạo một instance, chưa lưu vào DB.
    // this.repo.save(dto) sẽ tạo và lưu.
    return this.repo.save(dto as any); // Dùng as any để linh hoạt hơn với các loại DTO
  }

  /**
   * Cập nhật một thực thể.
   * DTO đầu vào chứa các thuộc tính muốn cập nhật.
   * @param id ID của thực thể cần cập nhật
   * @param dto Dữ liệu cập nhật
   * @returns Promise<T> Thực thể sau khi đã cập nhật
   */
  async update(id: string, dto: QueryDeepPartialEntity<T>): Promise<T> {
    // 1. Dùng getOne để kiểm tra sự tồn tại của entity và lấy về
    // getOne sẽ tự động throw lỗi nếu không tìm thấy
    const entity = await this.getOne({ id } as unknown as FindOptionsWhere<T>);

    // 2. Trộn (merge) dữ liệu từ DTO vào entity đã tìm thấy
    // TypeORM sẽ chỉ cập nhật các trường có trong DTO
    this.repo.merge(entity, dto as any);

    // 3. Lưu lại entity đã cập nhật
    return this.repo.save(entity);
  }

  /**
   * Xoá một thực thể.
   * @param id ID của thực thể cần xoá
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    // 1. Dùng getOne để đảm bảo entity tồn tại trước khi xoá
    const entity = await this.getOne({ id } as unknown as FindOptionsWhere<T>);

    // 2. Thực hiện xoá
    await this.repo.remove(entity);
  }

  /**
   * hook ghi de de relation
   * @param qb
   * @param dto
   * @protected
   */
  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<T>,
    dto: D,
  ): SelectQueryBuilder<T> {
    // Mặc định không làm gì cả
    return qb;
  }

  async list<D extends BaseListDto>(dto: D): Promise<PaginatedResult<T>> {
    const alias = dto.alias();
    let qb = this.repo.createQueryBuilder(alias);
    qb = this.addRelations(qb, dto);

    const columns = this.repo.metadata.columns.map((c) => c.propertyName);
    const allowSort = dto.allowSort() ?? columns;
    const allowSearch = dto.allowSearch() ?? [];
    const allowFilter = dto.allowFilter() ?? columns;

    // 1) SEARCH (nếu có)
    if (dto.q?.trim()) {
      const incoming = dto.searchFields?.length
        ? dto.searchFields
        : allowSearch;
      const valid = (incoming ?? []).filter((f) =>
        (allowSearch.length ? allowSearch : columns).includes(f),
      );
      if (valid.length) {
        const params: Record<string, any> = {};
        qb.andWhere(
          valid
            .map((f, i) => {
              params[`q${i}`] = `%${dto.q!.trim()}%`;
              return `${this.colAny(alias, f)} ILIKE :q${i}`;
            })
            .join(' OR '),
          params,
        );
      }
    }

    // 2) FILTER  ⬅️  ĐẶT ĐOẠN CODE CỦA BẠN Ở ĐÂY
    const rawFilter = this.safeParse((dto as any).filter) ?? {};
    for (const [key, raw] of Object.entries(rawFilter)) {
      if (!allowFilter.includes(key)) continue;

      const val = Array.isArray(raw)
        ? raw.map(this.normalizeVal)
        : this.normalizeVal(raw);
      const paramKey = `f_${key}`;

      if (Array.isArray(val)) {
        if (val.length > 0) {
          qb.andWhere(`${this.colAny(alias, key)} IN (:...${paramKey})`, {
            [paramKey]: val,
          });
        }
      } else if (val !== undefined && val !== null && val !== '') {
        // lưu ý: false vẫn qua được vì false !== ''
        qb.andWhere(`${this.colAny(alias, key)} = :${paramKey}`, {
          [paramKey]: val,
        });
      }
    }

    // 3) SORT (nếu không truyền => fallback theo PK)
    if (dto.sort?.trim()) {
      dto.sort
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((p) => {
          const [field, dirRaw] = p.split(':').map((s) => s.trim());
          const dir =
            (dirRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
          if (field && allowSort.includes(field)) {
            qb.addOrderBy(this.colAny(alias, field), dir, 'NULLS LAST');
          }
        });
    } else {
      const pk = this.repo.metadata.primaryColumns[0]?.propertyName;
      if (pk) qb.addOrderBy(this.col(alias, pk), 'DESC');
    }

    // 4) PAGINATION
    const maxLimit = dto.maxLimit?.() ?? 100;
    const limit = Math.min(Math.max(dto.limit ?? 20, 1), maxLimit);
    const page = Math.max(dto.page ?? 1, 1);
    const offset = (page - 1) * limit;
    qb.take(limit).skip(offset);

    // (tuỳ chọn) debug SQL
    const [sql, params] = qb.getQueryAndParameters();
    console.log(sql);
    console.log(params);

    // 5) EXECUTE
    const [rows, total] = await qb.getManyAndCount();
    const pageCount = Math.ceil(total / limit) || 1;
    return {
      data: rows,
      meta: {
        total,
        page,
        limit,
        pageCount,
        hasNext: page < pageCount,
        hasPrev: page > 1,
        sort: dto.sort,
      },
    };
  }
}

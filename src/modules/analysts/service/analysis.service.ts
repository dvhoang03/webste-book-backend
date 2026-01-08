import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Book, Order, OrderItem, RentalItem, User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Role } from '@/modules/user/user.enum';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';

@Injectable()
export class AnalysisService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly entity: Repository<User>,
    @InjectRepository(Book)
    private readonly bookEntity: Repository<Book>,
    @InjectRepository(Order)
    private readonly orderEntity: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemEntity: Repository<OrderItem>,
    @InjectRepository(RentalItem)
    private readonly rentalItemEntity: Repository<RentalItem>,

    private readonly dataSource: DataSource,
  ) {
    super(entity);
  }

  async getTotalUser() {
    const totalUser = await this.entity.countBy({ role: Role.USER });
    return { total: totalUser };
  }

  async getTotalBook() {
    const totalBook = await this.bookEntity.count();
    return { totalBook };
  }

  async getTotalOrder() {
    const totalOrder = await this.orderEntity.count();
    const totalOrderPaymentError = await this.orderEntity.countBy({
      status: OrderStatus.PAYMENT_ERROR,
    });
    const totalOrderWaitForShipping = await this.orderEntity.countBy({
      status: OrderStatus.WAIT_FOR_DELIVERY,
    });
    const totalOrderRefund = await this.orderEntity.countBy({
      status: OrderStatus.REFUNDED,
    });
    return {
      totalOrder,
      totalOrderPaymentError,
      totalOrderWaitForShipping,
      totalOrderRefund,
    };
  }

  async getMonthlyRevenue(year: number) {
    const raw = await this.orderEntity
      .createQueryBuilder('o')
      .innerJoin('o.payment', 'p')
      .select("DATE_TRUNC('month', o.createdAt)", 'month')
      .addSelect(
        `SUM(
          COALESCE(o.totalAmount, 0)
        + COALESCE(o.totalRentAmount, 0)
        - COALESCE(o.discount, 0)
      )`,
        'revenue',
      )
      .where('p.status = :status', { status: 'PAID' })
      .andWhere('EXTRACT(YEAR FROM o.createdAt) = :year', { year })
      .groupBy("DATE_TRUNC('month', o.createdAt)")
      .orderBy('month', 'ASC')
      .getRawMany();

    const revenueMap = new Map();
    raw.forEach((item) => {
      const month = new Date(item.month).getMonth() + 1;
      revenueMap.set(month, Number(item.revenue));
    });

    const result: { month: number; revenue: number }[] = [];
    for (let month = 1; month <= 12; month++) {
      result.push({
        month,
        revenue: revenueMap.get(month) || 0,
      });
    }
    return result;
  }

  // ==========================================
  // ✅ FIX 2: Cập nhật các hàm thống kê sách
  // ==========================================

  // 1. Top 10 sách MUA nhiều nhất
  async getTop10PurchasedBooks() {
    const query = this.orderItemEntity
      .createQueryBuilder('oi')
      .leftJoin('oi.book', 'book') // Join bảng Book
      .leftJoin('oi.order', 'order') // Join bảng Order
      .select([
        'book.id',
        'book.title',
        'book.sku', // ✅ Dùng sku thay slug
        'book.photoPath', // ✅ Dùng photoPath thay images
        // 'book.author'   // ❌ Bỏ author vì Book không có cột này (nó là relation)
      ])
      .addSelect('SUM(oi.quantity)', 'totalSold')
      .where('order.status != :status', { status: OrderStatus.PAYMENT_ERROR })
      .groupBy('book.id')
      // Postgres yêu cầu group by cả các cột được select (trừ hàm tổng hợp)
      .addGroupBy('book.title')
      .addGroupBy('book.sku')
      .addGroupBy('book.photoPath')
      .orderBy('"totalSold"', 'DESC')
      .limit(10);

    const result = await query.getRawMany();

    return result.map((item) => ({
      id: item.book_id,
      title: item.book_title,
      sku: item.book_sku,
      photoPath: item.book_photoPath,
      totalSold: Number(item.totalSold),
    }));
  }

  // 2. Top 10 sách THUÊ nhiều nhất
  async getTop10RentedBooks() {
    const query = this.rentalItemEntity
      .createQueryBuilder('ri')
      .leftJoin('ri.book', 'book')
      .leftJoin('ri.order', 'order')
      .select([
        'book.id',
        'book.title',
        'book.sku', // ✅ Fix
        'book.photoPath', // ✅ Fix
      ])
      .addSelect('SUM(ri.quantity)', 'totalRented')
      .where('order.status != :status', { status: OrderStatus.PAYMENT_ERROR })
      .groupBy('book.id')
      .addGroupBy('book.title')
      .addGroupBy('book.sku')
      .addGroupBy('book.photoPath')
      .orderBy('"totalRented"', 'DESC')
      .limit(10);

    const result = await query.getRawMany();

    return result.map((item) => ({
      id: item.book_id,
      title: item.book_title,
      sku: item.book_sku,
      photoPath: item.book_photoPath,
      totalRented: Number(item.totalRented),
    }));
  }

  // 3. Top 10 sách TỔNG HỢP (Mua + Thuê)
  async getTop10BooksOverall() {
    // ✅ FIX 3: Raw SQL chính xác theo Entity Book
    // Lưu ý: Cột "photoPath" thường được TypeORM tạo là "photoPath" (nếu giữ nguyên case)
    // hoặc "photo_path" (nếu dùng snake naming strategy).
    // Ở đây tôi dùng b."photoPath" (theo mặc định property name).
    // Nếu lỗi cột không tồn tại, hãy thử đổi thành b.photo_path

    const rawQuery = `
    SELECT 
      b.id AS "book_id",
      b.title AS "book_title",
      b.sku AS "book_sku",           -- ✅ Thay slug bằng sku
      b."photoPath" AS "book_image", -- ✅ Thay images bằng photoPath
      SUM(combined.qty) AS "total_count"
    FROM (
      -- Lấy sách Mua
      SELECT oi."bookId", oi.quantity AS qty
      FROM order_items oi
      JOIN orders o ON oi."orderId" = o.id
      WHERE o.status != $1
      
      UNION ALL
      
      -- Lấy sách Thuê
      SELECT ri."bookId", ri.quantity AS qty
      FROM rental_items ri
      JOIN orders o ON ri."orderId" = o.id
      WHERE o.status != $1
    ) AS combined
    JOIN books b ON b.id = combined."bookId"
    GROUP BY b.id, b.title, b.sku, b."photoPath"
    ORDER BY "total_count" DESC
    LIMIT 10
  `;

    const result = await this.dataSource.query(rawQuery, [
      OrderStatus.PAYMENT_ERROR,
    ]);

    return result.map((item) => ({
      id: item.book_id,
      title: item.book_title,
      sku: item.book_sku,
      photoPath: item.book_image,
      totalCount: Number(item.total_count),
    }));
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { AnalysisService } from '@/modules/analysts/service/analysis.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Analysis')
@SkipAuth()
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly service: AnalysisService) {}

  @ApiOperation({ summary: 'Api lay tong user' })
  @Get('user')
  async getTotalUser() {
    return await this.service.getTotalUser();
  }

  @ApiOperation({ summary: 'Api lay tong so book' })
  @Get('book')
  async getTotalBook() {
    return await this.service.getTotalBook();
  }

  @ApiOperation({ summary: 'Api lay tong so order, ddang chia theo ' })
  @Get('order')
  async getTotalOrder() {
    return await this.service.getTotalOrder();
  }

  @ApiOperation({ summary: 'Api lay doanh thu theo thang' })
  @ApiQuery({ name: 'year' })
  @Get('revenue-month')
  async getRevenueForMonth(@Query('year') year: number) {
    return await this.service.getMonthlyRevenue(year);
  }

  @ApiOperation({ summary: 'Api lay top 10 sach ban  chay nhat' })
  @Get('top10-purchase')
  async getTop10Purchase() {
    return await this.service.getTop10PurchasedBooks();
  }

  @ApiOperation({ summary: 'Api lay top 10 sach ban + thue chay nhat' })
  @Get('top10-rental')
  async getTop10Rental() {
    return await this.service.getTop10RentedBooks();
  }

  @ApiOperation({ summary: 'Api lay top 10 sach ban + thue chay nhat' })
  @Get('top10')
  async getTop10() {
    return await this.service.getTop10BooksOverall();
  }
}

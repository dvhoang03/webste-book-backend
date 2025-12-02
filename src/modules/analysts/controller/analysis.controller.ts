import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { UserService } from '@/modules/analysts/service/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Analysis')
@SkipAuth()
@Controller('analysis')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('user')
  async getTotalUser() {
    return await this.service.getTotalUser();
  }
}

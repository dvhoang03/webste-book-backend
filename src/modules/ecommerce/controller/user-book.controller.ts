import { Controller } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth } from '@/modules/auth/auth.decorator';

@ApiTagAndBearer('User/ Book')
@Controller('book')
@SkipAuth()
export class UserProductController {}

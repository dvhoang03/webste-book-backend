import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags as SwgApiTags } from '@nestjs/swagger';

export function ApiTagAndBearer(...tags: string[]) {
  return applyDecorators(ApiBearerAuth(), SwgApiTags(...tags));
}

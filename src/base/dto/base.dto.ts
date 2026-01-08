import { IsString, IsUUID } from 'class-validator';

export class PostgresIdParam {
  @IsString()
  @IsUUID()
  id: string;
}

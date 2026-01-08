import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '@/base/aws/aws.service';
import { config } from '@/config';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '@/modules/auth/auth.decorator';

@SkipAuth()
@ApiTags('Upload/ Image')
@Controller('upload')
export class UploadController {
  constructor(private readonly minioService: MinioService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.minioService.uploadFile(file);
    return {
      url: config.MINIO.expose(result.path),
      ...result,
    };
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const result = await this.minioService.uploadAvatar(file);
    return {
      origin: {
        url: config.MINIO.expose(result.original.path),
        ...result.original,
      },
      thumbnail: {
        url: config.MINIO.expose(result.thumbnail.path),
        ...result.thumbnail,
      },
    };
  }

  @Post('multiple')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.minioService.uploadFiles(files);
    return results.map((result) => {
      return {
        url: config.MINIO.expose(result.path),
        ...result,
      };
    });
  }
}
